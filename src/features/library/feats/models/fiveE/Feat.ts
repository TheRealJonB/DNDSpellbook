import { BaseModel } from "@/src/shared/models/BaseModel";

export type ScrapedFeat = Omit<Feat, 'id'>

export type SearchableFeat = Pick<Feat,
    'id' | 'name' | 'source' | 'prereq' | 'abilityScoreIncreased'>


export type FeatHeavyDetails = Omit<Feat, keyof SearchableFeat>

export interface FeatDBRow extends BaseModel {
    name: string;
    source: string;
    prereq: string;
    ability_score_increased: string;
    features: string;
    description: string;
}

export interface Feat extends BaseModel {
    name: string;
    source: string;
    prereq: string;
    abilityScoreIncreased: string[];
    features: Feature[];
    description: string[];
}

export interface Feature {
    info: string;
    table: Table;

}

export interface Table {
    description: string[];
    header: string[];
    entries: string[][];
}