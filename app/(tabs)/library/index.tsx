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
import { applyGenericFilters } from '@/src/shared/utils/applyGenericFilters';
import { buildFilterCategoriesFromData, FilterCategory } from '@/src/shared/utils/filters';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
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

  useEffect(() => {
    const selectedFilters = activeSpellFilters.flatMap((category) =>
      category.filterOptions
        .filter((option) => option.isSelected)
        .map((option) => ({ category: category.id, option: option.label }))
    );

    if (__DEV__) {
      console.log('[LibraryScreen] Spell filtering pipeline.', {
        isLoading: isSearchableSpellsLoading,
        availableSpellCount: lightSpells.length,
        selectedFilters,
        filteredSpellCount: filteredSpells.length,
        searchQuery: debouncedQuery,
        searchedSpellCount: searchedAndFilteredSpells.length,
        groupedSpellCounts: groupedSpells.map((spells, tabIndex) => ({
          tabIndex,
          count: spells.length,
        })),
      });
    }
  }, [
    activeSpellFilters,
    debouncedQuery,
    filteredSpells,
    groupedSpells,
    isSearchableSpellsLoading,
    lightSpells,
    searchedAndFilteredSpells,
  ]);

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


  if (isSearchableSpellsLoading) {
    return <ActivityIndicator size="small" color={colors.accentLight} />;
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
        onApplyCategory={setCurrentCategory}
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
