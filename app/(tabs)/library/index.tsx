import SpellList from '@/src/features/library/spells/components/SpellList';
import SpellListHeader from '@/src/features/library/spells/components/SpellListHeader';
import { SPELL_FILTERS } from '@/src/features/library/spells/constants/spellFilters';
import { useSpellsData } from '@/src/features/library/spells/hooks/useSpellsData';
import { groupSpellsByLevel } from '@/src/features/library/spells/utils/groupSpellsByLevel';
import { searchSpells } from '@/src/features/library/spells/utils/spellSearch';
import FilterBottomSheet, { FilterBottomSheetRef } from '@/src/shared/components/layout/FilterBottomSheet';
import LibraryCategoryBottomSheet, { LibraryCategoryBottomSheetRef } from '@/src/shared/components/layout/LibraryCategoryBottomSheet';
import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { applyGenericFilters } from '@/src/shared/utils/applyGenericFilters';
import { buildFilterCategoriesFromData, FilterCategory } from '@/src/shared/utils/filters';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const libraryCategories = [
  { label: '🔥 Spells', value: 'spells' },
  { label: '⚔️ Weapons & Armor', value: 'armor' },
  { label: '🧪 Magic Items', value: 'items' },
  // backgrounds, classes, equipment, feats, misc, mundane items (split this up probably), species
];


export default function LibraryScreen() {
  const [currentCategory, setCurrentCategory] = useState('spells');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // repeat for armor, magic items, etc
  const { lightSpells, isSearchableSpellsLoading } = useSpellsData();
  const [activeSpellFilters, setActiveSpellFilters] = useState<FilterCategory[]>(() =>
    buildFilterCategoriesFromData(SPELL_FILTERS)
  );
  const filteredSpells = useMemo(() => {
    return applyGenericFilters(lightSpells, activeSpellFilters);
  }, [lightSpells, activeSpellFilters]);
  const searchedAndFilteredSpells = useMemo(() => {
    return searchSpells(filteredSpells, debouncedQuery);
  }, [filteredSpells, debouncedQuery]);
  const groupedSpells = useMemo(() => {
    return groupSpellsByLevel(searchedAndFilteredSpells);
  }, [searchedAndFilteredSpells]);

  const filterBottomSheetRef = useRef<FilterBottomSheetRef>(null);
  const handleOpenFilterSheet = () => filterBottomSheetRef.current?.open();
  const handleCloseFilterSheet = () => filterBottomSheetRef.current?.close();

  const categoryBottomSheetRef = useRef<LibraryCategoryBottomSheetRef>(null);
  const handleOpenCategorySheet = () => categoryBottomSheetRef.current?.open();
  const handleCloseCategorySheet = () => categoryBottomSheetRef.current?.close();

  const insets = useSafeAreaInsets();
  const [headerLayoutHeight, setHeaderLayoutHeight] = useState(0);
  const handleHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderLayoutHeight(height);
  };
  const absoluteTopInset = useMemo(() => {
    console.log('top inset computed')
    return insets.top + headerLayoutHeight;
  }, [insets.top, headerLayoutHeight])


  // figure out how to get this to apply to any active filters
  // also reset filters when switching categories
  const isFilterActive = useMemo(() => {
    return activeSpellFilters.some((categoryGroup) =>
      categoryGroup.filterOptions.some((filterOption) => filterOption.isSelected)
    );
  }, [activeSpellFilters]); // Re-evaluates instantly whenever a checkbox is flipped


  const handleCategoryChange = (newCategory: string) => {
    setCurrentCategory(newCategory);
  };


  if (isSearchableSpellsLoading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <ScreenContainer>

      <SpellListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={isFilterActive}
        openFilterSheet={handleOpenFilterSheet}
        openCategorySheet={handleOpenCategorySheet}
        onLayout={handleHeaderLayout}
      />

      <SpellList
        groupedSpells={groupedSpells}
      />


      <LibraryCategoryBottomSheet
        ref={categoryBottomSheetRef}
        sheetTitle="Choose your Library Category"
        categories={libraryCategories}
        onApplyCategory={handleCategoryChange}
        currentCategory={currentCategory}
        topInset={absoluteTopInset}
      />


      <FilterBottomSheet
        ref={filterBottomSheetRef}
        filters={activeSpellFilters}
        onApplyFilters={setActiveSpellFilters}
        topInset={absoluteTopInset}
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
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark RPG theme
  },
  dropdownContainer: {
    padding: 16,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2a2a2a',
  },
  placeholderStyle: {
    color: '#aaa',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDesc: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});