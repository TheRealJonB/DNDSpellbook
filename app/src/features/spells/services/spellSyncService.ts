import { API_CONFIG } from '../../../shared/config/apiConfig';
import { fetchAllSpells } from '../api/spellApi';
import { Spell } from '../models/Spell';
import { clearSpells, getSpellCount, initSpellTable, loadSpells } from '../storage/spellStorage';

export async function initializeSpells(): Promise<Spell[]> {
  await initSpellTable();

  const count = await getSpellCount();

  if (count > 0) {
    // cache exists — load locally and sync in background
    const spells = await loadSpells();
    syncInBackground();
    return spells;
  }

  // no cache — must fetch from API before returning
  return await syncFromAPI();
}

export async function syncInBackground(): Promise<void> {
  try {
    await syncFromAPI();
  } catch (error) {
    // background sync failure is silent — user already has cached data
    console.warn('Background sync failed:', error);
  }
}

export async function syncFromAPI(): Promise<Spell[]> {
  console.log('Fetching from:', API_CONFIG.BASE_URL);
  try {
    const spells = await fetchAllSpells();
    console.log('Fetched:', spells.length);
    return spells;
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error name:', error instanceof Error ? error.name : 'unknown');
    throw error;
  }
}

export async function forceRefresh(): Promise<Spell[]> {
  await clearSpells();
  return await syncFromAPI();
}