import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LightSpell } from '../models/Spell';
import { getAllLightSpells, initializeSpells } from '../services/spellSyncService';

interface SpellContextType {
  lightSpells: LightSpell[];
  isLoading: boolean;
}

const SpellContext = createContext<SpellContextType | undefined>(undefined);


export function SpellProvider({ children }: { children: ReactNode }) {
  const [lightSpells, setSpells] = useState<LightSpell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAppData() {
      try {
        await initializeSpells();

        const loadedSpells = await getAllLightSpells();

        setSpells(loadedSpells);
      } catch (err) {
        console.error('Failed to initialize spells:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppData();
  }, []);

  return (
    <SpellContext.Provider value={{ lightSpells, isLoading }}>
      {children}
    </SpellContext.Provider>
  );
}

export function useSpells() {
  const context = useContext(SpellContext);
  if (context === undefined) {
    throw new Error('useSpells must be used within a SpellProvider');
  }
  
  return context;
}
