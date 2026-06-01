import spellsData from '../data/spells.json';
import { Spell } from '../models/Spell';

export function getAllSpells(): Spell[] {
  return spellsData as Spell[];
}

export function getSpellByName(name: string): Spell | undefined {
  return spellsData.find(
    (spell: Spell) => spell.name.toLowerCase() === name.toLowerCase()
  ) as Spell | undefined;
}