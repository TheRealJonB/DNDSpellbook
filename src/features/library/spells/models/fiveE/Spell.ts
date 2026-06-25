import { BaseModel } from "@/src/shared/models/BaseModel";

// only holds the fields that filtering needs
export type LightSpell = Pick<Spell,    'id'|'name'|'source'|'level'|'school'|'dndClassArray'|'castingTimeAbbr'|
                                        'range'|'duration'|'componentVerbal'|'componentSomatic'|'componentMaterial'|
                                        'componentGoldRequired'|'componentGoldConsumed'|'damageTypeArray'|
                                        'savingThrowArray'|'aoeShapeArray'|'spellAttack'|'ritual'>

export type SpellHeavyDetails = Pick<Spell, 'castingTime'|'description'|'upgrade'|'components'>

export interface Spell extends BaseModel {
    // LightSpell info
    name: string;
    source: string;
    level: number;
    school: string;
    dndClassArray: string[];
    castingTimeAbbr: string;
    range: string;
    duration: string;
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

    // HeavySpellDetails
    castingTime: string;
    description: string;
    upgrade: string | null;
    components: string;


    // things to implement later
    //   healing: string[];
    //   damage: stringp[];
    //   dieType: number;
    //   hasUpgrade: boolean;

}

export interface CharacterSpell extends Spell {
    isPrepared: number;
    numberOfFreeCastsPerDay: number;
}

export interface FlavoredSpell extends CharacterSpell {
    flavorName: string;
    flavorDescription: string;
}