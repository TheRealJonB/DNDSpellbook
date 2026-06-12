// import { Spell } from '../models/Spell';

// export function groupSpellsByLevel(spells: Spell[]): Spell[][] {
//   const groups: Spell[][] = Array.from({ length: 10 }, () => []);

//   for (const spell of spells) {
//     groups[spell.level].push(spell);
//   }

//   return groups;
// }

import { Spell } from '../models/Spell';

export interface SpellGroup {
  level: number;
  spells: Spell[];
}

export type SpellListItem =
  | { type: 'header'; level: number; count: number; isExpanded: boolean }
  | { type: 'spell'; spell: Spell; level: number };

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

export function buildFlatList(
  groups: SpellGroup[],
  expandedLevels: Set<number>
): SpellListItem[] {
  const items: SpellListItem[] = [];

  for (const group of groups) {
    const isExpanded = expandedLevels.has(group.level);
    items.push({
      type: 'header',
      level: group.level,
      count: group.spells.length,
      isExpanded,
    });
    if (isExpanded) {
      for (const spell of group.spells) {
        items.push({ type: 'spell', spell, level: group.level });
      }
    }
  }

  return items;
}