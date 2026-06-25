export interface BaseModel {
    id: number; // everything has a database id which will be likely tracked by other things
}

export interface UsedByCharacter extends BaseModel {
    characterId: number;
}