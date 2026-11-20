import { BaseModel } from "@/src/shared/models/BaseModel";

export interface LineageDBRow extends BaseModel {
    name: string;
    source: string | null;
    descriptionTable: string | null;
    abilityScoreIncrease: string | null;
    age: string | null;
    alignment: string | null;
    size: string | null;
    speed: string | null;
    languages: string | null;
    features: string | null;
}

export interface Lineage extends BaseModel {
    name: string;
    source: string | null;
    descriptionTable: Table | null;
    abilityScoreIncrease: Feature | null;
    age: Feature | null;
    alignment: Feature | null;
    size: Feature | null;
    speed: Feature | null;
    languages: Feature | null;
    features: Feature[] | null;
}

export interface Feature {
    name: string | null;
    descrioption: string | null;
    subBullets: Feature[] | null;
    table: Table | null;
}

export interface Table {
    header: string[] | null;
    entries: string[][] | null;
}