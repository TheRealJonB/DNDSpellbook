import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SpellLevelSection from '../../../src/features/spells/components/SpellLevelSection';
import { Spell } from '../../../src/features/spells/models/Spell';
import { applyFilters } from '../../../src/features/spells/services/spellFilterService';
import { getAllSpells } from '../../../src/features/spells/services/spellService';
import { EMPTY_FILTERS, FilterState, isFilterActive } from '../../../src/features/spells/store/filterStore';
import { groupSpellsByLevel, SpellGroup } from '../../../src/features/spells/utils/spellGrouping';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import EmptyState from '../../../src/shared/components/ui/EmptyState';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

const ALL_SPELLS = getAllSpells();

export default function SpellsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters: string }>();

  const filters: FilterState = params.filters
    ? JSON.parse(params.filters)
    : EMPTY_FILTERS;

  const [groups, setGroups] = useState<SpellGroup[]>([]);
  const [filteredCount, setFilteredCount] = useState(ALL_SPELLS.length);
  const filterActive = isFilterActive(filters);

  useEffect(() => {
    const filtered = applyFilters(ALL_SPELLS, filters);
    setFilteredCount(filtered.length);
    setGroups(groupSpellsByLevel(filtered));
  }, [params.filters]);

  function handleSpellPress(spell: Spell) {
    router.push(`/spells/${encodeURIComponent(spell.name)}`);
  }

  function handleFilterPress() {
    router.push({
      pathname: '/spells/filters',
      params: { filters: JSON.stringify(filters) },
    });
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Spells</Text>
          <Text style={styles.count}>
            {filteredCount}{filterActive ? ` of ${ALL_SPELLS.length}` : ''} spells
          </Text>
        </View>
        <Pressable
          onPress={handleFilterPress}
          style={[styles.filterButton, filterActive && styles.filterButtonActive]}
        >
          <Text style={[styles.filterButtonText, filterActive && styles.filterButtonTextActive]}>
            Filter{filterActive ? ' •' : ''}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <EmptyState
            message="No spells match your filters"
            subMessage="Try adjusting or clearing your filters"
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
  count: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  filterButton: {
    borderColor: colors.borderLight,
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  filterButtonText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  filterButtonTextActive: {
    color: colors.accentLight,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
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