import spellsData from '../data/spells.json';
import { Spell } from '../models/Spell';
import { getSpellCount, initSpellTable, loadSpells, saveSpells } from '../storage/spellStorage';

const SPELL_DATA_VERSION = 1; // bump this when spells.json is updated
const VERSION_KEY = 'spell_data_version';

export async function initializeSpells(): Promise<Spell[]> {
  await initSpellTable();

  const count = await getSpellCount();
  const storedVersion = await getStoredVersion();

  if (count === 0 || storedVersion < SPELL_DATA_VERSION) {
    // first launch or data update — seed from JSON
    console.log('Seeding spells from JSON...');
    await saveSpells(spellsData as Spell[]);
    await setStoredVersion(SPELL_DATA_VERSION);
  }

  return await loadSpells();
}

async function getStoredVersion(): Promise<number> {
  const db = await import('../../../shared/storage/storageClient').then(m => m.getDatabase());
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    [VERSION_KEY]
  );
  return row ? parseInt(row.value) : 0;
}

async function setStoredVersion(version: number): Promise<void> {
  const db = await import('../../../shared/storage/storageClient').then(m => m.getDatabase());
  await db.runAsync(
    'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
    [VERSION_KEY, version.toString()]
  );
}