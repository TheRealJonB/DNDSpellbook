/**
 * Represents a single interactive filter choice (e.g., a checkbox or a toggle chip)
 */
export interface FilterOption {
  id: string;        // A completely unique UI key (e.g., 'school-abjuration')
  label: string;     // The human-readable display text (e.g., 'Abjuration')
  isSelected: boolean; // The dynamic runtime state of this toggle
}

/**
 * Represents an entire group/category of filters (e.g., an accordion panel or dropdown list)
 */
export interface FilterCategory {
  id: string;              // The unique identifier for this category (e.g., 'school')
  title: string;           // The group's display title (e.g., 'Magic Schools')
  filterOptions: FilterOption[]; // The array of choices inside this category
}

/**
 * Represents the raw, static data structure before it is converted into UI state
 */
export interface FilterData {
  slug: string;            // The unique identifier string for the category
  title: string;           // The group's display title
  list: readonly string[]; // The static list of strings (supports 'as const' arrays)
}

/**
 * Transforms FilterData[] into FilterCategory[]. Constants put into objects I can use
 */
export const buildFilterCategoriesFromData = (filterData: FilterData[]): FilterCategory[] => {
  return filterData.map((filterDatum) => ({
    id: filterDatum.slug,
    title: filterDatum.title,
    filterOptions: filterDatum.list.map((item) => ({
      // E.g., 'school-abjuration' or 'casting-time-bonus-action'
      id: `${filterDatum.slug}-${item.toLowerCase().replace(/\s+/g, '-')}`,
      label: item,
      isSelected: false, // Baseline dynamic state
    })),
  }));
};
