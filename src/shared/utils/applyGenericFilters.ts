import { FilterCategory } from "../types/filters";

/**
 * A completely universal utility that filters any list of objects 
 * based on active FilterGroup checkbox selections.
 */
export function applyGenericFilters<T extends Record<string, any>>(
  dataList: T[], 
  filterGroups: FilterCategory[]
): T[] {
  if (!dataList || dataList.length === 0) return [];

  // 1. Collect only the categories and labels that are actively checked true
  const activeFilters = filterGroups.reduce((accumulator, group) => {
    const selectedLabels = group.options
      .filter((option) => option.isSelected)
      .map((option) => option.label);

    if (selectedLabels.length > 0) {
      accumulator[group.id] = selectedLabels;
    }
    return accumulator;
  }, {} as Record<string, string[]>);

  // Instant Exit Optimization
  if (Object.keys(activeFilters).length === 0) {
    return dataList;
  }

  // 2. Filter the items. An item must pass EVERY active filter category.
  return dataList.filter((item) => {
    return Object.entries(activeFilters).every(([groupId, selectedValues]) => {
      // Dynamic lookup using the group ID slug against the item's keys
      const itemValue = item[groupId];

      if (itemValue === undefined || itemValue === null) return false;

      // Handles Array properties (e.g., item.properties is ['Finesse', 'Light'])
      if (Array.isArray(itemValue)) {
        return itemValue.some((singleValue) => selectedValues.includes(String(singleValue)));
      }

      // Handles Standard String/Number fields (e.g., item.rarity is 'Rare')
      return selectedValues.includes(String(itemValue));
    });
  });
}
