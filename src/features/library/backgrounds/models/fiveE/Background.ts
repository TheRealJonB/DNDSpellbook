import { BaseModel } from "@/src/shared/models/BaseModel";

export interface BackgroundDBRow extends BaseModel {
    name: string;
    description: string | null;
    source: string | null;

    skills: string | null;
    tools: string | null;
    lang: string | null;
    equip: string | null;
    skillProficiencies: string | null;
    toolProficiencies: string | null;
    languages: string | null;
    equipment: string | null;

    variants: string | null;
    features: string | null;

    suggestedCharacteristics: string | null;
}

export interface Background extends BaseModel {
    name: string;
    description: string[];
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
    fixed: string[] | null;
    chooseCount: number[] | null;
    chooseFrom: string[][] | null;

    table: Table | null;
}

export interface Feature {
    name: string | null;
    description: string[] | null;

    table: Table | null;
}

export interface SuggestedCharacteristics {
    reference: string | null;
    description: string[] | null;
    referencedDescription: string[] | null;

    personalityTraits: Table | null;
    ideals: Table | null;
    bonds: Table | null;
    flaws: Table | null;
}

export interface Table {
    header: string[] | null;
    entries: string[][] | null;

}