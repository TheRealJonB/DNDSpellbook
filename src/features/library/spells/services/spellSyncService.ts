import { getSpellCount, getSpellDataVersion, initSpellTable, loadSpells, saveSpells, setSpellDataVersion } from '../../storage/spellStorage';
import spellsData from '../data/spells.json';
import { Spell } from '../models/Spell';

const SPELL_DATA_VERSION = 1;

export async function initializeSpells(): Promise<Spell[]> {
  await initSpellTable();

  const count = await getSpellCount();
  const storedVersion = await getSpellDataVersion();

  if (count === 0 || storedVersion < SPELL_DATA_VERSION) {
    // console.log('Seeding spells from JSON...');
    await saveSpells(spellsData as Spell[]);
    await setSpellDataVersion(SPELL_DATA_VERSION);
    // console.log('Spells in database after seed:', await getSpellCount());
    // console.log('Seeding complete');
  }

  const spells = await loadSpells();
  // console.log('loadSpells returned:', spells.length);
  return spells;
}