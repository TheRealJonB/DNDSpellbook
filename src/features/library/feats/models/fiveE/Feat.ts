import { BaseModel } from "@/src/shared/models/BaseModel";
import { Feature } from "@/src/shared/models/Feature";

 
export interface Feat extends BaseModel {
    name: string;
    source: string;
    prerequisite: string[]; // make this more specific? level, base ability score, previous feat, source material
    description: Feature[]; // "You gain the following benefits, and then it lists them"
    // these always only go up to 20
    statBonus: string;  // format it a certain way, like - separated for option INT-WIS-CHA or something. Could have it be a list of enum too
}