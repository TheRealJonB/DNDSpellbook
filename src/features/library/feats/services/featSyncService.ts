import featData from '../data/fiveE/feats.json';
import { Feat, FeatHeavyDetails, SearchableFeat } from '../models/fiveE/Feat';
import { getFeatCount, getFeatDataVersion, initFeatTable, loadFeatHeavyDetails, loadFullFeat, loadSearchableFeats, saveFeats, setFeatDataVersion } from '../storage/featStorage';

const FEAT_DATA_VERSION = 1;

export async function initializeFeats() {
  await initFeatTable();

  const count = await getFeatCount();
  const storedVersion = await getFeatDataVersion();

  if (count === 0 || storedVersion < FEAT_DATA_VERSION) {
    // console.log('Seeding feats from JSON...');
    await saveFeats(featData as Feat[]);
    await setFeatDataVersion(FEAT_DATA_VERSION);
    // console.log('Feats in database after seed:', await getFeatCount());
    // console.log('Seeding complete');
  }
}

export async function getSearchableFeats(): Promise<SearchableFeat[]> {
  return await loadSearchableFeats();
}

export async function getFeatHeavyDetails(rowid: number): Promise<FeatHeavyDetails | null> {
  return await loadFeatHeavyDetails(rowid);
}

export async function getFullFeat(rowid: number): Promise<Feat | null> {
  return await loadFullFeat(rowid);
}