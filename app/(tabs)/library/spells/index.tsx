import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SpellCard from '../../../../src/features/library/spells/components/SpellCard';
import SpellLevelSection from '../../../../src/features/library/spells/components/SpellLevelSection';
import SpellListHeader from '../../../../src/features/library/spells/components/SpellListHeader';
import { Spell } from '../../../../src/features/library/spells/models/Spell';
import { applyFilters } from '../../../../src/features/library/spells/services/spellFilterService';
import { searchSpells } from '../../../../src/features/library/spells/services/spellSearchService';
import { useFilters } from '../../../../src/features/library/spells/store/FilterContext';
import { isFilterActive } from '../../../../src/features/library/spells/store/filterStore';
import { useSpells } from '../../../../src/features/library/spells/store/SpellContext';
import { buildFlatList, groupSpellsByLevel, SpellListItem } from '../../../../src/features/library/spells/utils/spellGrouping';
import ScreenContainer from '../../../../src/shared/components/layout/ScreenContainer';
import EmptyState from '../../../../src/shared/components/ui/EmptyState';
import LoadingSpinner from '../../../../src/shared/components/ui/LoadingSpinner';
import { useDebounce } from '../../../../src/shared/hooks/useDebounce';
import { spacing } from '../../../../src/shared/theme/spacing';

export default function SpellsScreen() {
  const router = useRouter();
  const { spells: ALL_SPELLS, isLoading: spellsLoading } = useSpells();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(
    new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  );
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

  const groups = useMemo(() =>
    groupSpellsByLevel(searched),
    [searched]
  );

  const listItems = useMemo(() =>
    buildFlatList(groups, expandedLevels),
    [groups, expandedLevels]
  );

  function handleToggleLevel(level: number) {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }

  function handleSpellPress(spell: Spell) {
    router.push(`/(tabs)/library/spells/${encodeURIComponent(spell.name)}`);
  }

  function handleFilterPress() {
    router.push('/(tabs)/library/spells/filters');
  }

  const renderItem = useCallback(({ item }: { item: SpellListItem }) => {
    if (item.type === 'header') {
      return (
        <SpellLevelSection
          level={item.level}
          count={item.count}
          isExpanded={item.isExpanded}
          onToggle={handleToggleLevel}
        />
      );
    }
    return (
      <SpellCard
        spell={item.spell}
        onPress={handleSpellPress}
      />
    );
  }, [expandedLevels, filters, debouncedQuery]);

  const getItemType = useCallback((item: SpellListItem) => item.type, []);

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
      <FlashList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={item =>
          item.type === 'header' ? `header-${item.level}` : item.spell.name
        }
        getItemType={getItemType}
        ListHeaderComponent={
          <SpellListHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterActive={filterActive}
            onFilterPress={handleFilterPress}
            onBack={() => router.push('/(tabs)/library')}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              message="No spells found"
              subMessage={
                searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'Try adjusting your filters'
              }
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
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