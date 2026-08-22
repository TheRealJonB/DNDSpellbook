import { BaseModel } from "@/src/shared/models/BaseModel";

export interface WeaponDBRow extends BaseModel {
    name: string;
    cost: number;
    damage: string;
    weight: string;
    properties: string;
    martial: number;
    ranged: number;
    money_cost: number;
    damage_die: number;
    property_list: string;
}

export interface Weapon extends BaseModel {
    name: string;
    cost: number;
    damage: string;
    weight: string;
    properties: string;
    martial: boolean;
    ranged: boolean;
    moneyCost: number;
    damageDie: number;
    propertyList: string[];
}

export interface AmmunitionDBRow extends BaseModel {
    name: string;
    amount: number;
    cost: string;
    weight: string;
}

export interface Ammunition extends BaseModel {
    name: string;
    amount: number;
    cost: string;
    weight: string;
}

export interface WeaponPropertyDBRow extends BaseModel {
    name: string;
    description: string;
}

export interface WeaponProperty extends BaseModel {
    name: string;
    description: string;
}