// Persistent selected grade system
const SELECTED_GRADE_SYSTEM_KEY = 'selectedGradeSystem';

export async function getSelectedGradeSystem(): Promise<string> {
  const value = await storage.getItem(SELECTED_GRADE_SYSTEM_KEY);
  return value || 'V';
}

export async function setSelectedGradeSystem(id: string): Promise<void> {
  await storage.setItem(SELECTED_GRADE_SYSTEM_KEY, id);
}
// Storage logic for custom grade systems
import { CustomGradeSystem } from '../models/CustomGradeSystem';
import storage from './simpleStore';

const CUSTOM_GRADE_SYSTEMS_KEY = 'customGradeSystems';


export async function getCustomGradeSystems(): Promise<CustomGradeSystem[]> {
  const raw = await storage.getItem(CUSTOM_GRADE_SYSTEMS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CustomGradeSystem[];
  } catch {
    return [];
  }
}


export async function saveCustomGradeSystems(systems: CustomGradeSystem[]): Promise<void> {
  await storage.setItem(CUSTOM_GRADE_SYSTEMS_KEY, JSON.stringify(systems));
}

export async function addCustomGradeSystem(system: CustomGradeSystem): Promise<void> {
  const systems = await getCustomGradeSystems();
  systems.push(system);
  await saveCustomGradeSystems(systems);
}

export async function deleteCustomGradeSystem(id: string): Promise<void> {
  const systems = await getCustomGradeSystems();
  const updated = systems.filter(s => s.id !== id);
  await saveCustomGradeSystems(updated);
}
