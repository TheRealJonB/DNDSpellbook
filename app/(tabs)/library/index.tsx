import SpellList from '@/src/features/library/spells/components/SpellList';
import SpellListHeader from '@/src/features/library/spells/components/SpellListHeader';
import { applyFilters } from '@/src/features/library/spells/services/spellFilterService';
import { searchSpells } from '@/src/features/library/spells/services/spellSearchService';
import { useFilters } from '@/src/features/library/spells/store/FilterContext';
import { isFilterActive } from '@/src/features/library/spells/store/filterStore';
import { useSpells } from '@/src/features/library/spells/store/SpellContext';
import { groupSpellsByLevel } from '@/src/features/library/spells/utils/spellGrouping';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

const CONTENT_TYPES = [
  {
    key: 'spells',
    label: 'Spells',
    description: 'Browse all spells',
    available: true,
  },
  {
    key: 'magic-items',
    label: 'Magic Items',
    description: 'Coming soon',
    available: false,
  },
  {
    key: 'species',
    label: 'Species',
    description: 'Coming soon',
    available: false,
  },
  {
    key: 'classes',
    label: 'Classes',
    description: 'Coming soon',
    available: false,
  },
] as const;

export default function LibraryScreen() {
  const router = useRouter();
  const { lightSpells: LIGHT_SPELLS, isLoading: spellsLoading } = useSpells();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const filterActive = isFilterActive(filters);

  const filtered = useMemo(() =>
    applyFilters(LIGHT_SPELLS, filters),
    [LIGHT_SPELLS, filters]
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

  return (
    <ScreenContainer>
      <SpellListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={filterActive}
        onFilterPress={handleFilterPress}
      />

      <SpellList
        groupedSpells={groupedSpells}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs,
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  cardTitleDisabled: {
    color: colors.textSecondary,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xl,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});