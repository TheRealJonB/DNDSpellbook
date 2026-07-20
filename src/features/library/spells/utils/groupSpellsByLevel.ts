import { SearchableSpell } from "../models/fiveE/Spell";

export function groupSpellsByLevel(spells: SearchableSpell[]): SearchableSpell[][] {
  const groups: SearchableSpell[][] = Array.from({ length: 10 }, () => []);

  for (const spell of spells) {
    groups[spell.level].push(spell);
  }

  return groups;
}