import { LightSpell } from "../models/fiveE/Spell";

export function searchSpells(spells: LightSpell[], query: string): LightSpell[] {
  if (!query.trim()) return spells;
  const lower = query.toLowerCase().trim();
  return spells.filter(spell => spell.name.toLowerCase().includes(lower));
}