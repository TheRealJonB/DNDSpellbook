import { FilterCategory, FilterData } from '../types/filters';

/**
 * Transforms FilterData[] into FilterCategory[]. Constants put into objects I can use
 */
export const buildFilterCategoriesFromData = (filterData: FilterData[]): FilterCategory[] => {
  return filterData.map((filterDatum) => ({
    id: filterDatum.slug,
    title: filterDatum.title,
    options: filterDatum.list.map((item) => ({
      // E.g., 'school-abjuration' or 'casting-time-bonus-action'
      id: `${filterDatum.slug}-${item.toLowerCase().replace(/\s+/g, '-')}`,
      label: item,
      isSelected: false, // Baseline dynamic state
    })),
  }));
};
