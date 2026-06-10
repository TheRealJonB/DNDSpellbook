import * as Crypto from 'expo-crypto';
import { Character } from '../models/Character';
import {
  addSpellsToCharacters,
  deleteCharacter,
  initCharacterTable,
  loadCharacters,
  removeSpellsFromCharacter,
  saveCharacter
} from '../storage/characterStorage';

export async function initializeCharacters(): Promise<Character[]> {
  await initCharacterTable();
  return await loadCharacters();
}

export async function createCharacter(name: string): Promise<Character> {
  const character: Character = {
    id: Crypto.randomUUID(),
    name: name.trim(),
    spellNames: [],
    createdAt: new Date().toISOString(),
  };
  await saveCharacter(character);
  return character;
}

export async function getAllCharacters(): Promise<Character[]> {
  return await loadCharacters();
}

export async function removeCharacter(id: string): Promise<void> {
  await deleteCharacter(id);
}

export async function addSpells(characterId: string[], spellName: string[]): Promise<void> {
  await addSpellsToCharacters(characterId, spellName);
}

export async function removeSpells(characterId: string, spellName: string[]): Promise<void> {
  await removeSpellsFromCharacter(characterId, spellName);
}