export interface FilterState {
  levels: number[];
  schools: string[];
  classes: string[];
  damageTypes: string[];
  savingThrows: string[];
  aoeShapes: string[];
  castingTimes: string[];
  durations: string[];
  hasVerbal: boolean | null;
  hasSomatic: boolean | null;
  hasMaterial: boolean | null;
  materialCostContainsGP: boolean | null;
  materialIsConsumed: boolean | null;
  spellAttack: boolean | null;
  ritual: boolean | null;
}

export const EMPTY_FILTERS: FilterState = {
  levels: [],
  schools: [],
  classes: [],
  damageTypes: [],
  savingThrows: [],
  aoeShapes: [],
  castingTimes: [],
  durations: [],
  hasVerbal: null,
  hasSomatic: null,
  hasMaterial: null,
  materialCostContainsGP: null,
  materialIsConsumed: null,
  spellAttack: null,
  ritual: null,
};

export function isFilterActive(filters: FilterState): boolean {
  return (
    filters.levels.length > 0 ||
    filters.schools.length > 0 ||
    filters.classes.length > 0 ||
    filters.damageTypes.length > 0 ||
    filters.savingThrows.length > 0 ||
    filters.aoeShapes.length > 0 ||
    filters.castingTimes.length > 0 ||
    filters.durations.length > 0 ||
    filters.hasVerbal !== null ||
    filters.hasSomatic !== null ||
    filters.hasMaterial !== null ||
    filters.materialCostContainsGP !== null ||
    filters.materialIsConsumed !== null ||
    filters.spellAttack !== null ||
    filters.ritual !== null
  );
}