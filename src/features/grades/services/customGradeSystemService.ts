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

export async function loadAndRegisterAllCustomSystems(): Promise<void> {
  const customs = await getCustomGradeSystems();
  customs.forEach(cs => {
    const def = toDefinition(cs);
    registerCustomSystem(def);
  });
}

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

export function isUserSystem(id: string): boolean {
  const sys = getGradeSystem(id);
  return !!sys && sys.scope === 'user';
}

function clearUserSystemsFromRegistry() {
  const all = getAllGradeSystems();
  all.filter(s => s.scope === 'user').forEach(s => unregisterSystem(s.id));
}

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
