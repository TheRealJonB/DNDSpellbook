import adventuringGearData from '../data/fiveE/adventuringgeargroups.json';
import { AdventuringGearGroup } from '../models/fiveE/AdventuringGear';
import { getAdventuringGearCount, getAdventuringGearDataVersion, initAdventuringGearTable, loadAdventuringGearAll, loadAdventuringGearByID, saveAdventuringGear, setAdventuringGearDataVersion } from '../storage/adventuringGearStorage';

const ADVENTURING_GEAR_DATA_VERSION = 1;

export async function initializeAdventuringGear() {
  await initAdventuringGearTable();

  const count = await getAdventuringGearCount();
  const storedVersion = await getAdventuringGearDataVersion();

  if (count === 0 || storedVersion < ADVENTURING_GEAR_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveAdventuringGear(adventuringGearData as AdventuringGearGroup[]);
    await setAdventuringGearDataVersion(ADVENTURING_GEAR_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getAdventuringGearCount());
    // console.log('Seeding complete');
  }
}

export async function getAdventuringGearAll(): Promise<AdventuringGearGroup[]> {
  return await loadAdventuringGearAll();
}

export async function getAdventuringGearByID(rowid: number): Promise<AdventuringGearGroup | null> {
  return await loadAdventuringGearByID(rowid);
}