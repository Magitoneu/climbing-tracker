import { db } from '../../../config/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import type { Session, Attempt } from '../models/Session';
import { enrichBoulder, buildGradeSnapshot } from '../../grades/utils/gradeSnapshot';
import { auth } from '../../../config/firebase';

// Firestore collection path helper: users/{uid}/sessions
function sessionsCol(uid: string) {
  return collection(db, 'users', uid, 'sessions');
}

export interface CloudSession extends Omit<Session, 'id'> {
  id: string; // Firestore doc id
  userId: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  migrated?: boolean; // flag if created from local migration
}

/**
 * Converts a local Session object to Firestore document data format.
 * Enriches boulders and attempts with canonical grade snapshots for cross-system compatibility.
 *
 * @param session - Local session data (may lack id/userId/timestamps)
 * @param uid - Firebase user ID to associate with the session
 * @returns Firestore-ready document data with canonical grade enrichment
 * @internal
 */
function toDocData(session: Session, uid: string): Omit<CloudSession, 'id'> {
  // Derive durationMinutes from legacy shape if needed
  const durationMinutes =
    typeof session.durationMinutes === 'number' && !isNaN(session.durationMinutes)
      ? session.durationMinutes
      : undefined;
  const boulders = Array.isArray(session.boulders)
    ? session.boulders.map(b => enrichBoulder({ ...b }, session.gradeSystem))
    : [];
  // Build attempts fallback from boulders if attempts array missing/empty
  let attempts =
    Array.isArray(session.attempts) && session.attempts.length > 0
      ? session.attempts.map(a => ({ ...a }))
      : boulders.map(b => ({ grade: b.grade, attempts: b.attempts ?? 1, flashed: !!b.flashed }));
  // Enrich attempts array with canonical info (snapshot) to prepare for future normalization.
  attempts = attempts.map(a => {
    const snap = buildGradeSnapshot(a.grade, session.gradeSystem);
    return snap ? { ...a, canonicalValue: snap.canonicalValue, gradeSnapshot: snap } : a;
  });
  // Remove any obviously invalid attempt entries
  attempts = attempts.filter(a => !!a && typeof a.grade === 'string');
  // TODO Phase 2: enrich each boulder/attempt with canonical snapshot derived from selected grade system.
  const doc: any = {
    userId: uid,
    date: session.date,
    notes: session.notes || '',
    gradeSystem: session.gradeSystem,
    attempts,
    boulders,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    migrated: (session as any).migrated || false,
  };
  if (durationMinutes !== undefined) doc.durationMinutes = durationMinutes;
  return doc;
}

/**
 * Adds a new climbing session to Firestore with canonical grade enrichment.
 *
 * Automatically enriches boulders and attempts with grade snapshots containing:
 * - `canonicalValue`: Normalized difficulty on 0-18 scale for cross-system comparison
 * - `gradeSnapshot`: Original label, system ID, and version for historical accuracy
 *
 * @param session - Session data with date, duration, notes, grade system, and boulders/attempts
 * @returns Promise resolving to the Firestore document ID
 * @throws Error if user is not authenticated
 * @throws FirebaseError if Firestore write fails (e.g., network unavailable, permission denied)
 *
 * @example
 * ```ts
 * await addSession({
 *   date: '2025-10-11',
 *   durationMinutes: 90,
 *   gradeSystem: 'V',
 *   boulders: [{ grade: 'V5', flashed: false, attempts: 3 }],
 *   attempts: [{ grade: 'V5', attempts: 3, flashed: false }],
 * });
 * ```
 */
export async function addSession(session: Session): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const docRef = await addDoc(sessionsCol(user.uid), toDocData(session, user.uid));
  return docRef.id;
}

/**
 * Updates an existing session in Firestore with partial data.
 * Automatically sets the `updatedAt` timestamp.
 *
 * @param id - Firestore document ID of the session to update
 * @param partial - Partial session data to merge (e.g., { notes: 'Updated notes' })
 * @throws Error if user is not authenticated
 * @throws FirebaseError if document doesn't exist or update fails
 *
 * @example
 * ```ts
 * await updateSession('session-id-123', {
 *   notes: 'Felt strong today!',
 *   durationMinutes: 95,
 * });
 * ```
 */
export async function updateSession(id: string, partial: Partial<Session>) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'users', user.uid, 'sessions', id);
  await updateDoc(ref, {
    ...partial,
    updatedAt: serverTimestamp(),
  } as any);
}

/**
 * Deletes a session from Firestore permanently.
 *
 * @param id - Firestore document ID of the session to delete
 * @throws Error if user is not authenticated
 * @throws FirebaseError if document doesn't exist or delete fails
 *
 * @example
 * ```ts
 * await deleteSession('session-id-123');
 * ```
 */
export async function deleteSession(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'users', user.uid, 'sessions', id);
  await deleteDoc(ref);
}

export type UnsubscribeFn = () => void;

/**
 * Subscribes to real-time updates of the user's climbing sessions from Firestore.
 * Sessions are ordered by date (most recent first).
 *
 * Automatically enriches legacy sessions missing canonical grade information on-the-fly.
 * The callback fires immediately with current data, then again whenever sessions change.
 *
 * @param cb - Callback invoked with the updated session array on each change
 * @returns Unsubscribe function to stop listening to updates
 * @throws Error if user is not authenticated
 * @throws FirebaseError if query fails (e.g., network issues, permission denied)
 *
 * @example
 * ```ts
 * const unsubscribe = subscribeToSessions((sessions) => {
 *   console.log('Sessions updated:', sessions);
 *   setSessions(sessions);
 * });
 *
 * // Later: stop listening
 * unsubscribe();
 * ```
 */
export function subscribeToSessions(cb: (sessions: CloudSession[]) => void): UnsubscribeFn {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const q = query(sessionsCol(user.uid), orderBy('date', 'desc'));
  return onSnapshot(q, snap => {
    const out: CloudSession[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as any;
      // Enrich legacy entries missing canonical information
      if (Array.isArray(data.boulders)) {
        data.boulders = data.boulders.map((b: any) => enrichBoulder({ ...b }, data.gradeSystem));
      }
      if (Array.isArray(data.attempts)) {
        data.attempts = data.attempts.map((a: any) => {
          if (!a.canonicalValue || !a.gradeSnapshot) {
            const snap = buildGradeSnapshot(a.grade, data.gradeSystem);
            if (snap) {
              return { ...a, canonicalValue: snap.canonicalValue, gradeSnapshot: snap };
            }
          }
          return a;
        });
      }
      out.push({ id: docSnap.id, ...data } as CloudSession);
    });
    cb(out);
  });
}

/**
 * Migrates locally-stored sessions to Firestore (one-time operation after user authentication).
 *
 * Uses a heuristic (date + duration + boulder count) to detect and skip duplicates.
 * All migrated sessions are flagged with `migrated: true` for tracking.
 *
 * @param localSessions - Array of sessions stored in AsyncStorage before cloud sync
 * @returns Promise resolving to the number of sessions successfully migrated
 * @throws Error if user is not authenticated
 * @throws FirebaseError if batch write fails
 *
 * @example
 * ```ts
 * const localSessions = JSON.parse(await AsyncStorage.getItem('sessions') || '[]');
 * const count = await migrateLocalSessions(localSessions);
 * console.log(`Migrated ${count} sessions to cloud`);
 * ```
 */
export async function migrateLocalSessions(localSessions: Session[]): Promise<number> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const existingSnap = await getDocs(sessionsCol(user.uid));
  const existingKey = new Set<string>();
  existingSnap.forEach(d => {
    const data = d.data() as any;
    const key = `${data.date}|${data.durationMinutes}|${(data.boulders || []).length}`;
    existingKey.add(key);
  });
  const batch = writeBatch(db);
  let added = 0;
  for (const s of localSessions) {
    const key = `${s.date}|${s.durationMinutes}|${(s.boulders || []).length}`;
    if (!existingKey.has(key)) {
      const colRef = sessionsCol(user.uid);
      const docRef = doc(colRef);
      batch.set(docRef, { ...toDocData(s, user.uid), migrated: true });
      added++;
    }
  }
  if (added > 0) await batch.commit();
  return added;
}
