import { BaseModel } from "@/src/shared/models/BaseModel";

export interface AdventuringGearGroupDBRow extends BaseModel {
    name: string;
    description: string;
    table_header: string;
    gearList: string;
}

export interface AdventuringGearGroup extends BaseModel {
    name: string;
    description: string | null;
    tableHeader: string[];
    gearList: AdventuringGear[];
}

export interface AdventuringGear extends BaseModel{
    name: string;
    description: string | null;
    cost: string | null;
    weight: string | null;
    contents: string | null;
    capacity: string | null;
}