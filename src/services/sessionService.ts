import { db } from '../config/firebase';
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
import { enrichBoulder, buildGradeSnapshot } from '../utils/gradeSnapshot';
import { auth } from '../config/firebase';

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

// Convert local Session shape (currently without id/userId) to Firestore doc data
function toDocData(session: Session, uid: string): Omit<CloudSession, 'id'> {
  // Derive durationMinutes from legacy shape if needed
  const durationMinutes = typeof session.durationMinutes === 'number' && !isNaN(session.durationMinutes)
    ? session.durationMinutes
    : undefined;
  const boulders = Array.isArray(session.boulders) ? session.boulders.map(b => enrichBoulder({ ...b }, session.gradeSystem)) : [];
  // Build attempts fallback from boulders if attempts array missing/empty
  let attempts = Array.isArray(session.attempts) && session.attempts.length > 0
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

export async function addSession(session: Session): Promise<string> {
  const user = auth.currentUser; if (!user) throw new Error('Not authenticated');
  const docRef = await addDoc(sessionsCol(user.uid), toDocData(session, user.uid));
  return docRef.id;
}

export async function updateSession(id: string, partial: Partial<Session>) {
  const user = auth.currentUser; if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'users', user.uid, 'sessions', id);
  await updateDoc(ref, {
    ...partial,
    updatedAt: serverTimestamp(),
  } as any);
}

export async function deleteSession(id: string) {
  const user = auth.currentUser; if (!user) throw new Error('Not authenticated');
  const ref = doc(db, 'users', user.uid, 'sessions', id);
  await deleteDoc(ref);
}

export type UnsubscribeFn = () => void;

export function subscribeToSessions(cb: (sessions: CloudSession[]) => void): UnsubscribeFn {
  const user = auth.currentUser; if (!user) throw new Error('Not authenticated');
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

// Migration: take locally stored sessions (array) and push those not present in cloud
// We'll use date+duration+attempts length heuristic to avoid duplicates.
export async function migrateLocalSessions(localSessions: Session[]): Promise<number> {
  const user = auth.currentUser; if (!user) throw new Error('Not authenticated');
  const existingSnap = await getDocs(sessionsCol(user.uid));
  const existingKey = new Set<string>();
  existingSnap.forEach(d => {
    const data = d.data() as any;
    const key = `${data.date}|${data.durationMinutes}|${(data.boulders||[]).length}`;
    existingKey.add(key);
  });
  const batch = writeBatch(db);
  let added = 0;
  for (const s of localSessions) {
    const key = `${s.date}|${s.durationMinutes}|${(s.boulders||[]).length}`;
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
