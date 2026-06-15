import { LightSpell } from "../models/Spell";

export function groupSpellsByLevel(spells: LightSpell[]): LightSpell[][] {
  const groups: LightSpell[][] = Array.from({ length: 10 }, () => []);

  for (const spell of spells) {
    groups[spell.level].push(spell);
  }

  return groups;
}