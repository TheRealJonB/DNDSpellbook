import { Background } from "@/src/features/library/backgrounds/models/fiveE/Background";
import { Class, LightClass } from "@/src/features/library/classes/models/fiveE/Class";
import { Spell } from "@/src/features/library/spells/models/fiveE/Spell";
import { BaseModel } from "@/src/shared/models/BaseModel";
import { LightRace, Race } from "../../../library/lineages/models/fiveE/Race";

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}
export interface SkillProficiencies { // a 1 indicates proficiency, a 2 indicates expertise (how many times to multiply proficiency bonus to add)
  acrobatics: number;
  animalHandling: number;
  arcana: number;
  atheltics: number;
  deception: number;
  history: number;
  insight: number;
  intimidation: number;
  investigation: number;
  medicine: number;
  nature: number;
  perception: number;
  performance: number;
  persuasion: number;
  religion: number;
  slieghtOfHand: number;
  stealth: number;
  survival: number;
}
export interface WeaponProficiencies {
  // simple: number; if simple then I'll have a method to fill out all simple
  // martial: number; same for martial

  // simple melee

}




export type CampaignCharacter = Pick<Character, 'id' | 'name' | 'createdAt' | 'campaignId' | 'level'> & {
  lightRace: LightRace;
  lightClasses: LightClass[];
}
export interface Character extends BaseModel {
  // display information for a character card
  // "Level 5 Dragonborn Sorcerer or Level 7 Human Warlock 2 / Paladin 5"
  // createdAt is to order characters by earliest creation for human brain readability
  name: string;
  createdAt: string;
  campaignId: number;
  level: number;

  race: Race;             // raceId stored in database
  background: Background; // backgroundId stored in database
  classes: Class[];     // DO THIS junction table
  spellsKnown: Spell[]; // DO THIS junction table


  // skill stuff
  proficiencyBonus: number; // calculated based on level
  abilityScores: AbilityScores;             // flattened in db
  savingThrowProficiencies: AbilityScores;  // flattened in db
  skillProficiencies: SkillProficiencies;   // flattened in db

  // are these enum or not
  // languages: Language[];                      // DO THIS junction table
  // weaponProficiencies: Weapon[];
  // weaponMasteries: Weapon[];
  // armorProficiencies: string[];
  // toolProficiencies: string[];

  // combat
  // AC: number;
  // movespeed: number;
  // initiative: number;
  // resistances: string[];
  // vulnerabilities: string[];
  // immunities: string[];

  // features: Feature[];

  // inventory
  // inventoryIds: number[];

  // keeping track of
  // health: number;
  // temporaryHealth: number;
  // maxHPModifiers: number[];
  // spellSlots: number[]
  // pactMagicSlotNumber: number;
  // pactMagicSlotLevel: number;
  // deathSaves: number;
  // deathFails: number;

  // inventory?? 
  // armor, weapons, poitions, items,
  // track equiped weapons and armor? probably armor so can see where AC comes from




  // etc
}

