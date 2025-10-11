import { CustomGradeSystem } from '../models/CustomGradeSystem';
import { GradeEntry, GradeSystemDefinition } from '../models/GradeSystem';
import {
  addCustomGradeSystem,
  getCustomGradeSystems,
  saveCustomGradeSystems,
  deleteCustomGradeSystem,
} from '../../../storage/customGradeSystemStore';
import { registerCustomSystem, getAllGradeSystems, getGradeSystem, unregisterSystem } from './gradeSystemService';
import { db } from '../../../config/firebase';
import { auth } from '../../../config/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Converts a user's custom grade system to a full grade system definition.
 *
 * Transforms the simplified CustomGradeSystem format (used in storage/UI) into the complete
 * GradeSystemDefinition format required by the grade system registry. Assigns sequential
 * canonical values (0, 1, 2...) for approximate cross-system mapping.
 *
 * @param custom - User-defined custom grade system with name and color grades
 * @returns Full grade system definition ready for registration
 *
 * @example
 * ```ts
 * const customSystem: CustomGradeSystem = {
 *   id: 'user-mygym',
 *   name: 'My Gym Colors',
 *   grades: [
 *     { name: 'Green', color: '#00ff00' },
 *     { name: 'Blue', color: '#0000ff' },
 *   ]
 * };
 *
 * const definition = toDefinition(customSystem);
 * console.log(definition.grades[0]);
 * // { id: 'user-mygym-green', label: 'Green', canonicalValue: 0, color: '#00ff00', ... }
 * ```
 */
export function toDefinition(custom: CustomGradeSystem): GradeSystemDefinition {
  const id = custom.id || `user-${slugify(custom.name)}`;
  const grades: GradeEntry[] = custom.grades.map((g, idx) => ({
    id: `${id}-${slugify(g.name) || idx}`,
    label: g.name,
    displayOrder: idx,
    canonicalValue: idx, // MVP: sequential; cross-system mapping is approximate
    color: g.color,
  }));
  return {
    id,
    name: custom.name,
    discipline: 'boulder',
    version: 1,
    scope: 'user',
    grades,
    active: true,
  };
}

/**
 * Loads all custom grade systems from AsyncStorage and registers them in the runtime cache.
 *
 * Called during app initialization (after user login) to make custom systems available
 * throughout the app. Systems are loaded from local storage to ensure offline access.
 *
 * @returns Promise that resolves when all systems are registered
 *
 * @example
 * ```ts
 * // In App.tsx after authentication
 * useEffect(() => {
 *   if (user) {
 *     await loadAndRegisterAllCustomSystems();
 *     console.log('Custom systems loaded');
 *   }
 * }, [user]);
 * ```
 */
export async function loadAndRegisterAllCustomSystems(): Promise<void> {
  const customs = await getCustomGradeSystems();
  customs.forEach(cs => {
    const def = toDefinition(cs);
    registerCustomSystem(def);
  });
}

/**
 * Creates or updates a custom grade system across all storage layers.
 *
 * Performs a three-layer save:
 * 1. **AsyncStorage**: Saves locally for offline access and fast reads
 * 2. **Runtime Registry**: Registers for immediate use in pickers/conversions
 * 3. **Firestore**: Syncs to cloud (silently fails if offline)
 *
 * @param custom - Custom grade system to save (with or without existing id)
 * @returns Promise resolving to the system ID (generated from name if not provided)
 *
 * @example
 * ```ts
 * // Create new system
 * const id = await upsertCustomSystem({
 *   name: 'My Gym Colors',
 *   grades: [
 *     { name: 'Green', color: '#00ff00' },
 *     { name: 'Blue', color: '#0000ff' },
 *     { name: 'Red', color: '#ff0000' },
 *   ]
 * });
 * console.log(id); // 'user-my-gym-colors'
 *
 * // Update existing system
 * await upsertCustomSystem({
 *   id: 'user-my-gym-colors',
 *   name: 'My Gym Colors (Updated)',
 *   grades: [...], // modified grades
 * });
 * ```
 */
export async function upsertCustomSystem(custom: CustomGradeSystem): Promise<string> {
  // Save/replace in storage
  const systems = await getCustomGradeSystems();
  const id = custom.id || `user-${slugify(custom.name)}`;
  const exists = systems.findIndex(s => s.id === id);
  const payload: CustomGradeSystem = { ...custom, id };
  if (exists >= 0) systems[exists] = payload;
  else systems.push(payload);
  await saveCustomGradeSystems(systems);

  // Register in grade system cache
  registerCustomSystem(toDefinition(payload));
  // Cloud upsert
  try {
    const user = auth.currentUser;
    if (user) {
      const ref = doc(collection(db, 'users', user.uid, 'gradeSystems'), id);
      await setDoc(ref, payload, { merge: true });
    }
  } catch {
    // Silently fail cloud sync - system is saved locally and will sync when online
  }
  return id;
}

/**
 * Permanently deletes a custom grade system from all storage layers.
 *
 * Removes the system from:
 * 1. **AsyncStorage**: Local cache
 * 2. **Runtime Registry**: Pickers and conversion functions
 * 3. **Firestore**: Cloud storage (silently fails if offline)
 *
 * @param id - ID of the custom grade system to delete
 * @returns Promise that resolves when deletion completes
 *
 * @example
 * ```ts
 * await removeCustomSystem('user-oldgym');
 * // System no longer appears in grade pickers
 * // Sessions using this system will still display correct labels via snapshot
 * ```
 */
export async function removeCustomSystem(id: string): Promise<void> {
  await deleteCustomGradeSystem(id);
  // Remove from runtime cache so it no longer appears in pickers
  unregisterSystem(id);
  // Cloud delete
  try {
    const user = auth.currentUser;
    if (user) {
      const ref = doc(collection(db, 'users', user.uid, 'gradeSystems'), id);
      await deleteDoc(ref);
    }
  } catch {
    // Silently fail cloud delete - system is removed locally and will sync when online
  }
}

/**
 * Checks if a grade system ID represents a user-defined custom system.
 *
 * Returns false for builtin systems (V-Scale, Font) and true for custom systems.
 * Useful for conditionally showing edit/delete buttons in the UI.
 *
 * @param id - Grade system ID to check
 * @returns True if the system is user-defined, false if builtin or not found
 *
 * @example
 * ```ts
 * console.log(isUserSystem('vscale')); // false (builtin)
 * console.log(isUserSystem('font')); // false (builtin)
 * console.log(isUserSystem('user-mygym')); // true (custom)
 * console.log(isUserSystem('nonexistent')); // false (not found)
 * ```
 */
export function isUserSystem(id: string): boolean {
  const sys = getGradeSystem(id);
  return !!sys && sys.scope === 'user';
}

function clearUserSystemsFromRegistry() {
  const all = getAllGradeSystems();
  all.filter(s => s.scope === 'user').forEach(s => unregisterSystem(s.id));
}

/**
 * Subscribes to real-time updates of custom grade systems from Firestore.
 *
 * Automatically syncs cloud changes to local storage and runtime registry. The callback
 * fires immediately with current data, then again whenever systems are added/modified/deleted
 * in Firestore. Handles offline scenarios gracefully by retaining existing local systems.
 *
 * @param onChange - Optional callback invoked with updated systems array on each change
 * @returns Unsubscribe function to stop listening to updates (returns no-op if user not authenticated)
 *
 * @example
 * ```ts
 * // In App.tsx
 * useEffect(() => {
 *   if (user) {
 *     const unsubscribe = subscribeCustomGradeSystems((systems) => {
 *       console.log(`Loaded ${systems.length} custom grade systems`);
 *       // Update UI state if needed
 *     });
 *     return unsubscribe;
 *   }
 * }, [user]);
 * ```
 */
export function subscribeCustomGradeSystems(onChange?: (systems: CustomGradeSystem[]) => void) {
  const user = auth.currentUser;
  if (!user) return () => {};
  const col = collection(db, 'users', user.uid, 'gradeSystems');
  return onSnapshot(
    col,
    async snap => {
      const list: CustomGradeSystem[] = [];
      snap.forEach(d => {
        const data = d.data() as any;
        if (data && data.name && Array.isArray(data.grades)) {
          list.push({ id: d.id, name: data.name, grades: data.grades });
        }
      });
      // Save locally for offline
      await saveCustomGradeSystems(list);
      // Refresh registry
      clearUserSystemsFromRegistry();
      list.forEach(cs => registerCustomSystem(toDefinition(cs)));
      if (onChange) onChange(list);
    },
    error => {
      // Permission denied or other snapshot error: don't crash; leave existing local systems registered
      console.warn('Custom grade systems subscription error', error);
    }
  );
}

/**
 * Uploads all locally-stored custom grade systems to Firestore.
 *
 * Used for one-time migration or resyncing after extended offline use. Silently skips
 * systems that fail to upload (e.g., network issues, permission denied). Does not remove
 * local systems on failure, ensuring no data loss.
 *
 * @returns Promise that resolves when all uploads complete (or fail)
 *
 * @example
 * ```ts
 * // After user logs in following offline period
 * useEffect(() => {
 *   if (user) {
 *     pushLocalCustomGradeSystemsToCloud()
 *       .then(() => console.log('Local systems synced to cloud'))
 *       .catch(err => console.warn('Sync failed:', err));
 *   }
 * }, [user]);
 * ```
 */
export async function pushLocalCustomGradeSystemsToCloud() {
  const user = auth.currentUser;
  if (!user) return;
  const list = await getCustomGradeSystems();
  for (const cs of list) {
    const id = cs.id || `user-${slugify(cs.name)}`;
    try {
      const ref = doc(collection(db, 'users', user.uid, 'gradeSystems'), id);
      await setDoc(ref, { ...cs, id }, { merge: true });
    } catch {
      // Silently skip failed cloud upload - system remains in local cache
    }
  }
}
