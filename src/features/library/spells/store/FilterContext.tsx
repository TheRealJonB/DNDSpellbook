import { createContext, ReactNode, useContext, useState } from 'react';
import { EMPTY_FILTERS, FilterState } from './filterStore';

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: EMPTY_FILTERS,
  setFilters: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}