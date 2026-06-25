import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Character } from '../models/fiveE/Character';
import {
    addSpells,
    createCharacter,
    getAllCharacters,
    initializeCharacters,
    removeCharacter,
    removeSpells,
} from '../services/characterService';

interface CharacterContextType {
  characters: Character[];
  isLoading: boolean;
  createCharacter: (name: string) => Promise<Character>;
  deleteCharacter: (id: string) => Promise<void>;
  getCharacterById: (id: string) => Character | undefined;
  addSpells: (characterIds: string[], spellNames: string[]) => Promise<void>;
  removeSpells: (characterId: string, spellName: string[]) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType>({
  characters: [],
  isLoading: true,
  createCharacter: async () => ({ id: '', name: '', spellNames: [], createdAt: '' }),
  deleteCharacter: async () => {},
  getCharacterById: () => undefined,
  addSpells: async () => {},
  removeSpells: async () => {},
});

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeCharacters()
      .then(setCharacters)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleCreateCharacter(name: string): Promise<Character> {
    const character = await createCharacter(name);
    setCharacters(prev => [...prev, character]);
    return character;
  }

  async function handleDeleteCharacter(id: string): Promise<void> {
    await removeCharacter(id);
    setCharacters(prev => prev.filter(c => c.id !== id));
  }

  function getCharacterById(id: string): Character | undefined {
    return characters.find(c => c.id === id);
  }

  async function handleAddSpells(
    characterIds: string[],
    spellNames: string[]
  ): Promise<void> {
    await addSpells(characterIds, spellNames);
    const updated = await getAllCharacters();
    setCharacters(updated);
  }

  async function handleRemoveSpells(characterId: string, spellNames: string[]): Promise<void> {
    await removeSpells(characterId, spellNames);
    setCharacters(prev => prev.map(c =>
      c.id === characterId
        ? { ...c, spellNames: c.spellNames.filter(n => !spellNames.includes(n)) }
        : c
    ));
  }

  return (
    <CharacterContext.Provider value={{
      characters,
      isLoading,
      createCharacter: handleCreateCharacter,
      deleteCharacter: handleDeleteCharacter,
      getCharacterById,
      addSpells: handleAddSpells,
      removeSpells: handleRemoveSpells,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  return useContext(CharacterContext);
}