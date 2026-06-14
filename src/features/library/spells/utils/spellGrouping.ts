import { Spell } from "../models/Spell";

export function groupSpellsByLevel(spells: Spell[]): Spell[][] {
  const groups: Spell[][] = Array.from({ length: 10 }, () => []);

  for (const spell of spells) {
    groups[spell.level].push(spell);
  }

  return groups;
}