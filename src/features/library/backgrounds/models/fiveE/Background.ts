import { SkillProficiencies } from "@/src/features/campaigns/models/fiveE/Character";
import { BaseModel } from "@/src/shared/models/BaseModel";
import { Feature } from "@/src/shared/models/Feature";

export interface Background extends BaseModel {
    name: string;
    description: string;
    source: string;

    skillProficiencies: SkillProficiencies;
    toolProficiencies: string[]; // should this be a class?
    languages: string[];
    equipment: string[];
    features: Feature[];
}