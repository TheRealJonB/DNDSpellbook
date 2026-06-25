import { BaseModel } from "@/src/shared/models/BaseModel";

export interface Mastery extends BaseModel {
    name: string;
    description: string;
}

export interface Property extends BaseModel {
    name: string;
    description: string;
}

export interface Ammunition extends BaseModel {
    name: string;
    amount: number;
    storage: string;
    weight: number; 
    cost: number;
}

export interface Weapon extends BaseModel {
    name: string;
    damageDie: number;
    properties: string[];
    mastery: Mastery;
    weight: number;
    cost: number;
}