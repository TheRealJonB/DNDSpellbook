import { BaseModel } from "@/src/shared/models/BaseModel";

// only holds the fields that filtering needs
export type SearchableSpell = Pick<Spell,
                    'id'|'name'|'source'|'level'|'school'|
                    'castingTimeAbbr'|'ritual'|'range'|'componentVerbal'|'componentSomatic'|'componentMaterial'|
                    'componentGoldRequired'|'componentGoldConsumed'|'duration'|'damageTypeArray'|
                    'savingThrowArray'|'aoeShapeArray'|'spellAttack'|
                    'dndClasses'>

export type SpellHeavyDetails = Pick<Spell, 'castingTime'|'description'|'upgrade'|'components'>

export type ScrapedSpell = Omit<Spell, 'id'>

export interface Spell extends BaseModel {
    // SearchableSpell info
    name: string;
    source: string;
    level: number;
    school: string;
    
    castingTime: string;
    castingTimeAbbr: string;
    ritual: boolean;
    range: string;
    components: string;
    componentVerbal: boolean;
    componentSomatic: boolean;
    componentMaterial: boolean;
    componentGoldRequired: boolean;
    componentGoldConsumed: boolean;
    duration: string;

    description: string[];
    damageTypeArray: string[];
    savingThrowArray: string[];
    aoeShapeArray: string[];
    spellAttack: boolean;

    upgrade: string | null;
    dndClasses: string[];

}

export interface CharacterSpell extends Spell {
    isPrepared: number;
    numberOfFreeCastsPerDay: number;
}

export interface FlavoredSpell extends CharacterSpell {
    flavorName: string;
    flavorDescription: string;
}