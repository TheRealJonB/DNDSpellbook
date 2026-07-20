import { FilterData } from "@/src/shared/utils/filters";


const SOURCES = [
  'Player\'s Handbook', 
] as const;


// Export the raw configuration data blueprint
export const SPELL_FILTERS: FilterData[] = [
  { slug: 'source', title: 'Source Material', list: SOURCE }, 
  { slug: 'level', title: 'Level', list: SPELL_LEVELS }, 
  { slug: 'school', title: 'School', list: SPELL_SCHOOLS }, 
  { slug: 'dndClasses', title: 'Class', list: SPELL_CLASSES }, 
  { slug: 'castingTimeAbbr', title: 'Casting Time', list: CASTING_TIMES },
  { slug: 'range', title: 'Class', list: RANGE }, 
  { slug: 'duration', title: 'Duration', list: DURATIONS }, 
  { slug: 'damageTypeArray', title: 'Damage Type', list: DAMAGE_TYPES }, 
  { slug: 'savingThrowArray', title: 'Saving Throw', list: SAVING_THROWS }, 
  { slug: 'aoeShapeArray', title: 'AOE Shapes', list: AOE_SHAPES }, 

]; 
    // things to implement later
    //   healing: string[];
    //   damage: stringp[];
    //   dieType: number;
    //   hasUpgrade: boolean;