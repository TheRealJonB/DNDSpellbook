import { BaseModel } from "@/src/shared/models/BaseModel";

export interface Campaign extends BaseModel{
  id: number;
  name: string;
  dungeonMaster: string;
  createdAt: string;
  edition: number;
  allowedSources: string[];
  characterIds: number[];
}