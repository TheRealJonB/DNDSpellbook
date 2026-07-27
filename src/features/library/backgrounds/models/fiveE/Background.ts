import { BaseModel } from "@/src/shared/models/BaseModel";

export interface Background extends BaseModel {
    name: string;
    description: string;
    source: string;

    skills: string;
    tools: string;
    lang: string;
    equip: string;
    skillProficiencies: Choices;
    toolProficiencies: Choices;
    languages: Choices;
    equipment: Choices;

    variants: Feature[];
    features: Feature[];

    suggestedCharacteristics: SuggestedCharacteristics;
}

export interface Choices {
    fixed: string[];
    chooseCount: number[];
    chooseFrom: string[][];

    table: Table;
}

export interface Feature {
    name: string;
    description: string[];

    table: Table;
}

export interface SuggestedCharacteristics {
    reference: string;
    description: string[];
    referencedDescription: string[];

    personalityTraits: Table;
    ideals: Table;
    bonds: Table;
    flaws: Table;
}

export interface Table {
    header: string[];
    entries: string[][];

}