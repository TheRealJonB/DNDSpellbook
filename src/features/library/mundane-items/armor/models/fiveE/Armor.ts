import { BaseModel } from "@/src/shared/models/BaseModel";

export interface ArmorDBRow extends BaseModel {
    name: string;
    armor_class: string;
    str_req: string | null;
    stealth: string | null;
    weight: string;
    cost: string;
    armor_type: string; 
}

export interface Armor extends BaseModel {
    name: string;
    armorClass: string;
    strReq: string | null;
    stealth: string | null;
    weight: string;
    cost: string;
    armorType: string; 
}

export interface DonDoffTime extends BaseModel {
    armorCategory: string;
    don: string;
    doff: string;
}

export interface ArmorProficiency extends BaseModel {
    name: string;
    description: string;
}