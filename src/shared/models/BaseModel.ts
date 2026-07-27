export interface BaseModel {
    id: number | null; // everything has a database id which will be likely tracked by other things
}

export interface UsedByCharacter extends BaseModel {
    characterId: number;
}