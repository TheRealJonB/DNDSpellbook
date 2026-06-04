import { Spell } from '../models/Spell';
import { FilterState } from '../store/filterStore';

export function applyFilters(spells: Spell[], filters: FilterState): Spell[] {
  return spells.filter(spell => {

    // level — OR within category
    if (filters.levels.length > 0 && !filters.levels.includes(spell.level)) {
      return false;
    }

    // school — OR within category
    if (filters.schools.length > 0 && !filters.schools.includes(spell.school)) {
      return false;
    }

    // class — OR within category
    if (filters.classes.length > 0 && !filters.classes.some(c => spell.classes.includes(c))) {
      return false;
    }

    // damage type — OR within category
    if (filters.damageTypes.length > 0 && !filters.damageTypes.some(d => spell.damageTypeArray.includes(d))) {
      return false;
    }

    // saving throw — OR within category
    if (filters.savingThrows.length > 0 && !filters.savingThrows.some(s => spell.savingThrowArray.includes(s))) {
      return false;
    }

    // aoe shape — OR within category
    if (filters.aoeShapes.length > 0 && !filters.aoeShapes.some(a => spell.aoeShapeArray.includes(a))) {
      return false;
    }

    // casting time — matches against castingTimeAbbr
    if (filters.castingTimes.length > 0 && !filters.castingTimes.includes(spell.castingTimeAbbr)) {
      return false;
    }

    // duration
    if (filters.durations.length > 0 && !filters.durations.includes(spell.duration)) {
      return false;
    }

    // boolean toggles — null means ignore, true/false means filter
    if (filters.hasVerbal !== null && spell.hasVerbal !== filters.hasVerbal) return false;
    if (filters.hasSomatic !== null && spell.hasSomatic !== filters.hasSomatic) return false;
    if (filters.hasMaterial !== null && spell.hasMaterial !== filters.hasMaterial) return false;
    if (filters.materialCostContainsGP !== null && spell.materialCostContainsGP !== filters.materialCostContainsGP) return false;
    if (filters.materialIsConsumed !== null && spell.materialIsConsumed !== filters.materialIsConsumed) return false;
    if (filters.spellAttack !== null && spell.spellAttack !== filters.spellAttack) return false;
    if (filters.ritual !== null && spell.ritual !== filters.ritual) return false;

    return true;
  });
}