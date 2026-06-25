import { BaseModel } from "@/src/shared/models/BaseModel";

export interface Armor extends BaseModel {
    name: string;
    // light/medium/heavy/shield (time to don&doff is 1 min done 1 min doff / 5 min don 1 min doff / 10 min don 5 min doff / action don action doff)
    type: string; 
    armorClass: string;
    strengthRequirement: number;
    givesStealthDisadvantage: number;
    weight: number;
    cost: number;
}