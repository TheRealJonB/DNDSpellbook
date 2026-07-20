import { SearchableSpell } from "../models/fiveE/Spell";

export function searchSpells(spells: SearchableSpell[], query: string): SearchableSpell[] {
  if (!query.trim()) return spells;
  const lower = query.toLowerCase().trim();
  return spells.filter(spell => spell.name.toLowerCase().includes(lower));
}