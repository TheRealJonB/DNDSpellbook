// src/features/library/shared/hooks/useLibraryData.ts
import { useEffect, useState } from 'react';

export function useInitializeCampaignTable() {
    const [isLibraryReady, setIsLibraryReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function setupDatabase() {
            try {
                await initializeSpells();
                if (isMounted) {
                    setIsLibraryReady(true);
                }
            } catch (error) {
                console.error("Critical database creation failure:", error);
                if (isMounted) setIsLibraryReady(true);
            }
        }

        setupDatabase();
        return () => { isMounted = false; }; // Prevent memory leak crashes on rapid tab changes
    }, []);

    return { isLibraryReady };
}

export function useSpellsData() {
    const [lightSpells, setLightSpells] = useState<LightSpell[]>([]);
    const [isLightSpellsLoading, setIsLightSpellsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchLightSpells() {
            try {
                setIsLightSpellsLoading(true);

                const loadedSpells = await getAllLightSpells();

                if (isMounted) {
                    setLightSpells(loadedSpells);
                    setIsLightSpellsLoading(false);
                }
            } catch (error) {
                console.error("Spell database fetch failure:", error);
                if (isMounted) setIsLightSpellsLoading(false);
            }
        }

        fetchLightSpells();
        return () => { isMounted = false; }; // Prevent memory leak crashes on rapid tab changes
    }, []);

    return { lightSpells, isLightSpellsLoading };
}
