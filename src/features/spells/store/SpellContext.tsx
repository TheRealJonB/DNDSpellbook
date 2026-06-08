import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Spell } from '../models/Spell';
import { initializeSpells } from '../services/spellSyncService';

interface SpellContextType {
  spells: Spell[];
  isLoading: boolean;
  getSpellByName: (name: string) => Spell | undefined;
}

const SpellContext = createContext<SpellContextType>({
  spells: [],
  isLoading: true,
  getSpellByName: () => undefined,
});

export function SpellProvider({ children }: { children: ReactNode }) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeSpells()
      .then(setSpells)
      .finally(() => setIsLoading(false));
  }, []);

  function getSpellByName(name: string): Spell | undefined {
    return spells.find(s => s.name.toLowerCase() === name.toLowerCase());
  }

  return (
    <SpellContext.Provider value={{ spells, isLoading, getSpellByName }}>
      {children}
    </SpellContext.Provider>
  );
}

export function useSpells() {
  return useContext(SpellContext);
}