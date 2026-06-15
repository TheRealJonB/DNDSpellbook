// src/features/library/shared/hooks/useLibraryData.ts
import { useEffect, useState } from 'react';
import { LightSpell } from '../../spells/models/Spell';
import { getAllLightSpells, initializeSpells } from '../../spells/services/spellSyncService';

export function useSpellsData() {
    const [lightSpells, setLightSpells] = useState<LightSpell[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        async function fetchDatabaseItems() {
            try {
                await initializeSpells();

                if (lightSpells.length == 0) {
                    const loadedSpells = await getAllLightSpells();
                    setLightSpells(loadedSpells);
                }

                if (isMounted) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Database fetch failure:", error);
                if (isMounted) setIsLoading(false);
            }
        }

        fetchDatabaseItems();
        return () => { isMounted = false; }; // Prevent memory leak crashes on rapid tab changes
    }, []);

    return { lightSpells, isLoading };
}
