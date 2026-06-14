import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import SpellList from '../../../../src/features/library/spells/components/SpellList';
import SpellListHeader from '../../../../src/features/library/spells/components/SpellListHeader';
import { applyFilters } from '../../../../src/features/library/spells/services/spellFilterService';
import { searchSpells } from '../../../../src/features/library/spells/services/spellSearchService';
import { useFilters } from '../../../../src/features/library/spells/store/FilterContext';
import { isFilterActive } from '../../../../src/features/library/spells/store/filterStore';
import { useSpells } from '../../../../src/features/library/spells/store/SpellContext';
import { groupSpellsByLevel } from '../../../../src/features/library/spells/utils/spellGrouping';
import ScreenContainer from '../../../../src/shared/components/layout/ScreenContainer';
import LoadingSpinner from '../../../../src/shared/components/ui/LoadingSpinner';
import { useDebounce } from '../../../../src/shared/hooks/useDebounce';
import { spacing } from '../../../../src/shared/theme/spacing';

export default function SpellsScreen() {
  const router = useRouter();
  const { lightSpells: ALL_SPELLS, isLoading: spellsLoading } = useSpells();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const filterActive = isFilterActive(filters);

  const filtered = useMemo(() =>
    applyFilters(ALL_SPELLS, filters),
    [ALL_SPELLS, filters]
  );

  const searched = useMemo(() =>
    searchSpells(filtered, debouncedQuery),
    [filtered, debouncedQuery]
  );

  const groupedSpells = useMemo(() =>
    groupSpellsByLevel(searched),
    [searched]
  );

  function handleFilterPress() {
    router.push('/(tabs)/library/spells/filters');
  }

  if (spellsLoading) {
    return (
      <ScreenContainer>
        <SpellListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterActive={filterActive}
          onFilterPress={handleFilterPress}
          onBack={() => router.push('/(tabs)/library/spells')}
        />
        <LoadingSpinner message="Loading spells..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SpellListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={filterActive}
        onFilterPress={handleFilterPress}
        onBack={() => router.back()}
      />
      <SpellList
        groupedSpells={groupedSpells}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    marginTop: spacing.xxl,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});