import { FilterCategory } from "./filters";

/**
 * A completely universal utility that filters any list of objects 
 * based on active FilterGroup checkbox selections.
 */
export function applyGenericFilters<T extends Record<string, any>>(
  dataList: T[], 
  filterCategories: FilterCategory[]
): T[] {
  if (!dataList || dataList.length === 0) {
    if (__DEV__) {
      console.log('[applyGenericFilters] No data available to filter.', {
        filterCategoryCount: filterCategories.length,
      });
    }
    return [];
  }

  // 1. Collect only the categories and labels that are actively checked true
  const activeFilters = filterCategories.reduce((accumulator, filterCategory) => {
    const selectedLabels = filterCategory.filterOptions
      .filter((filterOption) => filterOption.isSelected)
      .map((filterOption) => filterOption.label);

    if (selectedLabels.length > 0) {
      accumulator[filterCategory.id] = selectedLabels;
    }
    return accumulator;
  }, {} as Record<string, string[]>);

  // Instant Exit Optimization
  if (Object.keys(activeFilters).length === 0) {
    if (__DEV__) {
      console.log('[applyGenericFilters] No active filters; returning all items.', {
        itemCount: dataList.length,
      });
    }
    return dataList;
  }

  const normalize = (value: unknown) => String(value).trim().toLowerCase();

  const matchesSelectedValues = (itemValue: unknown, selectedValues: string[]) => {
    if (itemValue === undefined || itemValue === null) return false;

    const matches = (value: unknown) =>
      selectedValues.some((selected) => normalize(selected) === normalize(value));

    if (Array.isArray(itemValue)) {
      return itemValue.some(matches);
    }

    return matches(itemValue);
  };

  // 2. Filter the items. An item must pass EVERY active filter category.
  const filteredData = dataList.filter((item) =>
    Object.entries(activeFilters).every(([categoryId, selectedValues]) =>
      matchesSelectedValues(item[categoryId], selectedValues)
    )
  );

  if (__DEV__) {
    console.log('[applyGenericFilters] Filter results.', {
      inputCount: dataList.length,
      activeFilters,
      resultCount: filteredData.length,
    });
  }

  if (__DEV__ && filteredData.length === 0) {
    const diagnostics = Object.entries(activeFilters).map(([categoryId, selectedValues]) => {
      const availableValues = dataList.flatMap((item) => {
        const itemValue = item[categoryId];
        if (itemValue === undefined || itemValue === null) return [];
        return Array.isArray(itemValue)
          ? itemValue.map(String)
          : [String(itemValue)];
      });

      return {
        categoryId,
        selectedValues,
        matchingItemCount: dataList.filter((item) =>
          matchesSelectedValues(item[categoryId], selectedValues)
        ).length,
        sampleAvailableValues: Array.from(new Set(availableValues)).slice(0, 12),
      };
    });

    console.warn('[applyGenericFilters] No items matched. Check field names and values.', diagnostics);
  }

  return filteredData;
}
