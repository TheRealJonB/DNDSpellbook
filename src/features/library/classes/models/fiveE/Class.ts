import { BaseModel } from "@/src/shared/models/BaseModel";

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