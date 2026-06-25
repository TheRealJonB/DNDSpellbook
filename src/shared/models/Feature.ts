import { BaseModel } from "./BaseModel";

export interface Feature extends BaseModel {
    // of the form CLASS_BARBARIAN_RAGE or FEAT_LUCKY or SUBCLASS_ARMORER_GUARDIAN_TMPHP or RACE_DRAGONBORN_BREATH
    featureKey: string;
    // what the feature is actually titled (usually the thing in bold)
    name: string;
    description: string;
    levelRequirement: number | null; // used for tracking if character can learn class abilities
    maxUsesRule: string | null; // make this an enum too?
    resetsOn: string | null; // make this an enum
}

export interface FeatureUseTracker extends BaseModel {
    // of the form CLASS_BARBARIAN_RAGE or FEAT_LUCKY or SUBCLASS_ARMORER_GUARDIAN_TMPHP or RACE_DRAGONBORN_BREATH
    featureKey: string;
    usesMaxCalculated: number;
    usesCurrent: number;
}