import { BaseModel, Feature } from "@/src/shared/models/BaseModel";

export interface Species extends BaseModel {
    name: string;
    statBonus: string; // in the format "+2-STR_+1-CON" accounts for +2/+2 and variant human and custom lineage
    creatureType: string;
    size: string;
    speed: number;
    features: Feature[];
}

export type LightSpecies = Pick<Species, 'id' | 'name'>;