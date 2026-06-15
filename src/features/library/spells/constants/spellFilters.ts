import { FilterData } from "@/src/shared/types/filters";


const SPELL_SCHOOLS = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation',
] as const;

const SPELL_CLASSES = [
  'Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid',
  'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue',
  'Sorcerer', 'Warlock', 'Wizard',
] as const;

const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force',
  'Lightning', 'Necrotic', 'Piercing', 'Poison',
  'Psychic', 'Radiant', 'Slashing', 'Thunder',
] as const;

const SAVING_THROWS = [
  'Charisma', 'Constitution', 'Dexterity',
  'Intelligence', 'Strength', 'Wisdom',
] as const;

const AOE_SHAPES = [
  'Cone', 'Cube', 'Cylinder', 'Line', 'Sphere', 'Square', 'Wall',
] as const;

const SPELL_LEVELS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
] as const;

const CASTING_TIMES = [
  'Action', 'Bonus Action', 'Reaction', '1 Minute',
  '10 Minutes', '1 Hour', '8 Hours', '12 Hours', '24 Hours',
] as const;

const DURATIONS = [
  '1 Hour', '1 Minute', '1 Round', '10 Minutes',
  '24 Hours', '8 Hours', 'Instantaneous', 'Until Dispelled',
] as const;

// Export the raw configuration data blueprint
export const SPELL_FILTERS: FilterData[] = [
  { slug: 'school', title: 'School', list: SPELL_SCHOOLS }, 
  { slug: 'class', title: 'Class', list: SPELL_CLASSES }, 
  { slug: 'damage-type', title: 'Damage Type', list: DAMAGE_TYPES }, 
  { slug: 'saving-throw', title: 'Saving Throw', list: SAVING_THROWS }, 
  { slug: 'aoe-shape', title: 'AOE Shapes', list: AOE_SHAPES }, 
  { slug: 'level', title: 'Level', list: SPELL_LEVELS }, 
  { slug: 'casting-time', title: 'Casting Time', list: CASTING_TIMES }, 
  { slug: 'duration', title: 'Duration', list: DURATIONS }, 
];