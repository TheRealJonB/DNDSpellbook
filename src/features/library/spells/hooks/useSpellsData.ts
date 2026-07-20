// src/features/library/shared/hooks/useLibraryData.ts
import { useEffect, useState } from 'react';
import { getAllSearchableSpells, initializeSpells } from '../../spells/services/spellSyncService';
import { SearchableSpell } from '../models/fiveE/Spell';

export function useInitializeSpellTable() {
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
    const [lightSpells, setSearchableSpells] = useState<SearchableSpell[]>([]);
    const [isSearchableSpellsLoading, setIsSearchableSpellsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchSearchableSpells() {
            try {
                setIsSearchableSpellsLoading(true);

                const loadedSpells = await getAllSearchableSpells();

                if (isMounted) {
                    setSearchableSpells(loadedSpells);
                    setIsSearchableSpellsLoading(false);
                }
            } catch (error) {
                console.error("Spell database fetch failure:", error);
                if (isMounted) setIsSearchableSpellsLoading(false);
            }
        }

        fetchSearchableSpells();
        return () => { isMounted = false; }; // Prevent memory leak crashes on rapid tab changes
    }, []);

    return { lightSpells, isSearchableSpellsLoading };
}
