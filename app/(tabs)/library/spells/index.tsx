import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Spell } from '../../../../src/features/library/spells/models/Spell';
import { applyFilters } from '../../../../src/features/library/spells/services/spellFilterService';
import { searchSpells } from '../../../../src/features/library/spells/services/spellSearchService';
import { useFilters } from '../../../../src/features/library/spells/store/FilterContext';
import { isFilterActive } from '../../../../src/features/library/spells/store/filterStore';
import { useSpells } from '../../../../src/features/library/spells/store/SpellContext';
import { groupSpellsByLevel } from '../../../../src/features/library/spells/utils/spellGrouping';
import EmptyState from '../../../../src/shared/components/ui/EmptyState';
import LoadingSpinner from '../../../../src/shared/components/ui/LoadingSpinner';
import { useDebounce } from '../../../../src/shared/hooks/useDebounce';
import { colors } from '../../../../src/shared/theme/colors';
import { spacing } from '../../../../src/shared/theme/spacing';
import { typography } from '../../../../src/shared/theme/typography';


export default function SpellsScreen() {
  const router = useRouter();
  const { spells: ALL_SPELLS, isLoading: spellsLoading } = useSpells();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const filterActive = isFilterActive(filters);

  // derive directly instead of storing in state
  const filtered = applyFilters(ALL_SPELLS, filters);
  const searched = searchSpells(filtered, debouncedQuery);
  const groups = groupSpellsByLevel(searched);

  function handleSpellPress(spell: Spell) {
    router.push(`/library/spells/${encodeURIComponent(spell.name)}`);
  }

  function handleFilterPress() {
    router.push('/library/spells/filters');
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
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(tabs)/library')}>
          <Text style={styles.backText}>← Library</Text>
        </Pressable>
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
      </View>
      

      {/* 
      <FlatList
        // what do these do
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // ------------------
        data={groupedSpells}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SpellLevelSection // rename to CollapsibleSpellList i think
            key={group.level}
            level={index}
            onSpellPress={handleSpellPress}
            spells={item}
          /> 
        )}
        ListEmptyComponent={<EmptyState
            message="No spells found"
            subMessage={
              searchQuery
                ? `No results for "${searchQuery}"`
                : 'Try adjusting your filters'
            }
          />}
        // Performance boosters for 400+ total nested items
        // may be buggy, especially on ios
        // Also note this does not save significant memory because the views are not deallocated, only detached.
        // https://reactnative.dev/docs/optimizing-flatlist-configuration#removeclippedsubviews
        removeClippedSubviews={true}
        // https://reactnative.dev/docs/optimizing-flatlist-configuration#initialnumtorender
        initialNumToRender={4} // spell levels not individual spells
        // https://reactnative.dev/docs/optimizing-flatlist-configuration#maxtorenderperbatch
        maxToRenderPerBatch={3}
        // https://reactnative.dev/docs/optimizing-flatlist-configuration#windowsize
        windowSize={5}
      /> 
      */}

      // 3 Tips for Empty StatesFlexbox Centering: To center your empty message exactly in the middle of the screen, you must add flexGrow: 1 to the contentContainerStyle prop, not the regular style prop.Dynamic Styling: You can conditionally apply this centering style by checking data.length === 0 (as shown in the code above) so it doesn't distort your layout when data actually loads.Component Support: ListEmptyComponent fully respects your list's ListHeaderComponent and ListFooterComponent. If you use them, your empty state will safely render perfectly sandwiched right between them.
      // create a reusable spell list component that this screen can use and the character can use for their specific spell list
      // should have input for the list of spells, and what the message is when its empty (click to add spells vs no spells found by your query)
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
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
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