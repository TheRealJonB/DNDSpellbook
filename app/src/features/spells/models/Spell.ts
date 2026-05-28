export interface Spell {
  name: string;
  source: string;
  level: number;
  school: string;
  classes: string[];
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  upgrade: string | null;
  hasVerbal: boolean;
  hasSomatic: boolean;
  hasMaterial: boolean;
  materialCostContainsGP: boolean;
  materialIsConsumed: boolean;
  damageTypeArray: string[];
  savingThrowArray: string[];
  aoeShapeArray: string[];
  isSpellAttack: boolean;
}