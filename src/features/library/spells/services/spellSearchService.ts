import { Spell } from '../models/Spell';

export function searchSpells(spells: Spell[], query: string): Spell[] {
  if (!query.trim()) return spells;
  const lower = query.toLowerCase().trim();
  return spells.filter(spell => spell.name.toLowerCase().includes(lower));
}