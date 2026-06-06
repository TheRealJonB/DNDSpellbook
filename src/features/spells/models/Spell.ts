export interface Spell {
  name: string;
  source: string;
  level: number;
  school: string;
  classes: string[];
  castingTime: string;
  castingTimeAbbr: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  upgrade: string | null;
  componentVerbal: boolean;
  componentSomatic: boolean;
  componentMaterial: boolean;
  componentGoldRequired: boolean;
  componentGoldConsumed: boolean;
  damageTypeArray: string[];
  savingThrowArray: string[];
  aoeShapeArray: string[];
  spellAttack: boolean;
  ritual: boolean;
}