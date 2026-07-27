import armorData from '../data/fiveE/armors.json';
import { Armor } from '../models/fiveE/Armor';
import { getArmorCount, getArmorDataVersion, initArmorTable, loadArmorAll, loadArmorById, saveArmor, setArmorDataVersion } from '../storage/armorStorage';

const ARMOR_DATA_VERSION = 1;

export async function initializeAdventuringGear() {
  await initArmorTable();

  const count = await getArmorCount();
  const storedVersion = await getArmorDataVersion();

  if (count === 0 || storedVersion < ARMOR_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveArmor(armorData as Armor[]);
    await setArmorDataVersion(ARMOR_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getArmorCount());
    // console.log('Seeding complete');
  }
}

export async function getArmorAll(): Promise<Armor[]> {
  return await loadArmorAll();
}

export async function getArmorById(rowid: number): Promise<Armor | null> {
  return await loadArmorById(rowid);
}