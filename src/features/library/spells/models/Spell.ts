// only holds the fields that filtering needs
export interface LightSpell {
    rowid: number;
    name: string;
    source: string;
    level: number;
    school: string;
    classes: string[];
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

    // things to implement
    //   healing: string[];
    //   damage: stringp[];
    //   dieType: number;
    //   hasUpgrade: boolean;
}

export interface SpellHeavyDetails {
    castingTime: string;
    description: string;
    upgrade: string | null;
    components: string;
}

export interface Spell {
    rowid: number;
    name: string;
    source: string;
    level: number;
    school: string;
    classes: string[];
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

    // things to implement
    //   healing: string[];
    //   damage: stringp[];
    //   dieType: number;
    //   hasUpgrade: boolean;

    
    castingTime: string;
    description: string;
    upgrade: string | null;
    components: string;
}