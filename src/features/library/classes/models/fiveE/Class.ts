import { BaseModel } from "@/src/shared/models/BaseModel";
import { Feature } from "@/src/shared/models/Feature";



export interface Subclass extends BaseModel {
    name: string;
    features: Feature[];
}

export type LightClass = Pick<Class, 'name' | 'level'>
export interface Class extends BaseModel {
    name: string;
    level: number;
    source: string;
    subclass: Subclass;
    features: Feature[];
}