import { BaseModel } from "@/src/shared/models/BaseModel";

export interface WeaponDBRow extends BaseModel {
    name: string;
    cost: string;
    damage: string;
    weight: string;
    properties: string;
    martial: boolean;
    ranged: boolean;
    money_cost: string;
    damage_die: string;
    property_list: string;
}

export interface Weapon extends BaseModel {
    name: string;
    cost: string;
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
    amount: string;
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