import { BaseModel } from "@/src/shared/models/BaseModel";

export type SearchableFeat = Pick<Feat,
    'id' | 'name' | 'source' | 'prereq' | 'abilityScoreIncreased'>


export type FeatHeavyDetails = Omit<Feat, keyof SearchableFeat>

export interface FeatDBRow extends BaseModel {
    name: string;
    source: string;
    prereq: string;
    ability_score_increased: string;
    features: string;
    // heavy details
    description: string;
}

export interface Feat extends BaseModel {
    name: string;
    source: string | null;
    prereq: string | null;
    abilityScoreIncreased: string[] | null;
    features: Feature[] | null;
    // heavy details
    description: string[] | null;
}

export interface Feature {
    info: string | null;
    table: Table | null;

}

export interface Table {
    description: string[];
    header: string[];
    entries: string[][];
}