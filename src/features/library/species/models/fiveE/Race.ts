import { BaseModel } from "@/src/shared/models/BaseModel";
import { Feature } from "@/src/shared/models/Feature";



export type LightRace = Pick<Race, 'name'>
export interface Race extends BaseModel {
    name: string;
    statBonus: string; // in the format "+2-STR_+1-CON" accounts for +2/+2 and variant human and custom lineage
    creatureType: string;
    size: string;
    speed: number;
    features: Feature[];
}