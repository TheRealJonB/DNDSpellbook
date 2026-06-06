export interface FilterState {
  levels: number[];
  schools: string[];
  classes: string[];
  damageTypes: string[];
  savingThrows: string[];
  aoeShapes: string[];
  castingTimes: string[];
  durations: string[];
  componentVerbal: boolean | null;
  componentSomatic: boolean | null;
  componentMaterial: boolean | null;
  componentGoldRequired: boolean | null;
  componentGoldConsumed: boolean | null;
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
  componentVerbal: null,
  componentSomatic: null,
  componentMaterial: null,
  componentGoldRequired: null,
  componentGoldConsumed: null,
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
    filters.componentVerbal !== null ||
    filters.componentSomatic !== null ||
    filters.componentMaterial !== null ||
    filters.componentGoldRequired !== null ||
    filters.componentGoldConsumed !== null ||
    filters.spellAttack !== null ||
    filters.ritual !== null
  );
}