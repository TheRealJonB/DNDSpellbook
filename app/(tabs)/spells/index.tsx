import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import SpellLevelSection from '../../../src/features/spells/components/SpellLevelSection';
import { Spell } from '../../../src/features/spells/models/Spell';
import { applyFilters } from '../../../src/features/spells/services/spellFilterService';
import { searchSpells } from '../../../src/features/spells/services/spellSearchService';
import { useFilters } from '../../../src/features/spells/store/FilterContext';
import { isFilterActive } from '../../../src/features/spells/store/filterStore';
import { useSpells } from '../../../src/features/spells/store/SpellContext';
import { groupSpellsByLevel, SpellGroup } from '../../../src/features/spells/utils/spellGrouping';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import EmptyState from '../../../src/shared/components/ui/EmptyState';
import LoadingSpinner from '../../../src/shared/components/ui/LoadingSpinner';
import { useDebounce } from '../../../src/shared/hooks/useDebounce';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

export default function SpellsScreen() {
  const router = useRouter();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<SpellGroup[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 100);
  const filterActive = isFilterActive(filters);
  const { spells: ALL_SPELLS, isLoading: spellsLoading } = useSpells();

  useEffect(() => {
    const filtered = applyFilters(ALL_SPELLS, filters);
    const searched = searchSpells(filtered, debouncedQuery);
    setGroups(groupSpellsByLevel(searched));
  }, [filters, debouncedQuery]);

  function handleSpellPress(spell: Spell) {
    router.push(`/spells/${encodeURIComponent(spell.name)}`);
  }

  function handleFilterPress() {
    router.push('/spells/filters');
  }

  if (spellsLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner message="Loading spells..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={16}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spells..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable
          onPress={handleFilterPress}
          style={[styles.filterButton, filterActive && styles.filterButtonActive]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? colors.accentLight : colors.textMuted}
          />
          {filterActive && <View style={styles.filterDot} />}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {groups.length === 0 ? (
          <EmptyState
            message="No spells found"
            subMessage={
              searchQuery
                ? `No results for "${searchQuery}"`
                : 'Try adjusting your filters'
            }
          />
        ) : (
          groups.map(group => (
            <SpellLevelSection
              key={group.level}
              level={group.level}
              onSpellPress={handleSpellPress}
              spells={group.spells}
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    alignItems: 'center',
    borderColor: colors.borderLight,
    borderRadius: 8,
    borderWidth: 0.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  filterButtonActive: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  filterDot: {
    backgroundColor: colors.accentLight,
    borderRadius: 3,
    bottom: 6,
    height: 6,
    position: 'absolute',
    right: 6,
    width: 6,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
    borderRadius: 8,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: typography.sizes.md,
  },
  searchRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});