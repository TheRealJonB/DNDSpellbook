import { Spell } from '../models/Spell';

export interface SpellGroup {
  level: number;
  spells: Spell[];
}

export function groupSpellsByLevel(spells: Spell[]): SpellGroup[] {
  const groups = new Map<number, Spell[]>();

  for (const spell of spells) {
    if (!groups.has(spell.level)) {
      groups.set(spell.level, []);
    }
    groups.get(spell.level)!.push(spell);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([level, spells]) => ({ level, spells }));
}