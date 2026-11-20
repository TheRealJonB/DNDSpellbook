import backgroundData from '../data/fiveE/backgrounds.json';
import { Background } from '../models/fiveE/Background';
import { getBackgroundCount, getBackgroundDataVersion, initBackgroundTable, loadBackgroundById, loadBackgroundsAll, saveBackgrounds, setBackgroundDataVersion } from '../storage/backgroundStorage';

const BACKGROUND_DATA_VERSION = 1;

export async function initializeBackgrounds() {
  await initBackgroundTable();

  const count = await getBackgroundCount();
  const storedVersion = await getBackgroundDataVersion();

  if (count === 0 || storedVersion < BACKGROUND_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveBackgrounds(backgroundData as Omit<Background, 'id'>[]);
    await setBackgroundDataVersion(BACKGROUND_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getWeaponCount());
    // console.log('Seeding complete');
  }
}


export async function getBackgroundAll(): Promise<Background[]> {
  return await loadBackgroundsAll();
}

export async function getBackgroundById(rowid: number): Promise<Background | null> {
  return await loadBackgroundById(rowid);
}
