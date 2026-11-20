import lineagesData from '../data/fiveE/lineages.json';
import { Lineage } from '../models/fiveE/Lineage';
import { getLineageCount, getLineageDataVersion, initLineageTable, loadLineageById, loadLineagesAll, saveLineages, setLineageDataVersion } from '../storage/lineageStorage';

const LINEAGE_DATA_VERSION = 1;

export async function initializeLineages() {
  await initLineageTable();

  const count = await getLineageCount();
  const storedVersion = await getLineageDataVersion();

  if (count === 0 || storedVersion < LINEAGE_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveLineages(lineagesData as Omit<Lineage, 'id'>[]);
    await setLineageDataVersion(LINEAGE_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getWeaponCount());
    // console.log('Seeding complete');
  }
}


export async function getLineagesAll(): Promise<Lineage[]> {
  return await loadLineagesAll();
}

export async function getLineagesById(rowid: number): Promise<Lineage | null> {
  return await loadLineageById(rowid);
}
