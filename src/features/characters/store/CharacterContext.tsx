import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character } from '../models/Character';
import {
  initializeCharacters,
  createCharacter,
  removeCharacter,
  addSpell,
  removeSpell,
} from '../services/characterService';

interface CharacterContextType {
  characters: Character[];
  isLoading: boolean;
  createCharacter: (name: string) => Promise<Character>;
  deleteCharacter: (id: string) => Promise<void>;
  addSpellToCharacter: (characterId: string, spellName: string) => Promise<void>;
  removeSpellFromCharacter: (characterId: string, spellName: string) => Promise<void>;
  getCharacterById: (id: string) => Character | undefined;
}

const CharacterContext = createContext<CharacterContextType>({
  characters: [],
  isLoading: true,
  createCharacter: async () => ({ id: '', name: '', spellNames: [], createdAt: '' }),
  deleteCharacter: async () => {},
  addSpellToCharacter: async () => {},
  removeSpellFromCharacter: async () => {},
  getCharacterById: () => undefined,
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

  async function handleAddSpell(characterId: string, spellName: string): Promise<void> {
    await addSpell(characterId, spellName);
    setCharacters(prev => prev.map(c =>
      c.id === characterId && !c.spellNames.includes(spellName)
        ? { ...c, spellNames: [...c.spellNames, spellName] }
        : c
    ));
  }

  async function handleRemoveSpell(characterId: string, spellName: string): Promise<void> {
    await removeSpell(characterId, spellName);
    setCharacters(prev => prev.map(c =>
      c.id === characterId
        ? { ...c, spellNames: c.spellNames.filter(n => n !== spellName) }
        : c
    ));
  }

  function getCharacterById(id: string): Character | undefined {
    return characters.find(c => c.id === id);
  }

  return (
    <CharacterContext.Provider value={{
      characters,
      isLoading,
      createCharacter: handleCreateCharacter,
      deleteCharacter: handleDeleteCharacter,
      addSpellToCharacter: handleAddSpell,
      removeSpellFromCharacter: handleRemoveSpell,
      getCharacterById,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  return useContext(CharacterContext);
}