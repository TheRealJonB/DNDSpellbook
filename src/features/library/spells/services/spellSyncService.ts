import spellsData from '../data/spells.json';
import { ScrapedSpell, SearchableSpell, Spell, SpellHeavyDetails } from '../models/fiveE/Spell';
import { getSpellCount, getSpellDataVersion, initSpellTable, loadFullSpell, loadSearchableSpells, loadSpellHeavyDetails, saveSpells, setSpellDataVersion } from '../storage/spellStorage';

const SPELL_DATA_VERSION = 1;

export async function initializeSpells() {
  await initSpellTable();

  const count = await getSpellCount();
  const storedVersion = await getSpellDataVersion();

  if (count === 0 || storedVersion < SPELL_DATA_VERSION) {
    // console.log('Seeding spells from JSON...');
    await saveSpells(spellsData as ScrapedSpell[]);
    await setSpellDataVersion(SPELL_DATA_VERSION);
    // console.log('Spells in database after seed:', await getSpellCount());
    // console.log('Seeding complete');
  }
}

export async function getAllSearchableSpells(): Promise<SearchableSpell[]> {
  return await loadSearchableSpells();
}

export async function getSpellHeavyDetails(rowid: number): Promise<SpellHeavyDetails | null> {
  return await loadSpellHeavyDetails(rowid);
}

export async function getFullSpell(rowid: number): Promise<Spell | null> {
  return await loadFullSpell(rowid);
}