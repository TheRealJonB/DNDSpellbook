import { Spell } from '../models/Spell';
import { loadSpells } from '../storage/spellStorage';

export async function getAllSpells(): Promise<Spell[]> {
  return await loadSpells();
}

export async function getSpellByName(name: string): Promise<Spell | undefined> {
  const spells = await loadSpells();
  return spells.find(spell => spell.name.toLowerCase() === name.toLowerCase());
}