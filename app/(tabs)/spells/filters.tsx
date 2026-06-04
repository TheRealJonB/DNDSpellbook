import { useRouter } from 'expo-router';
import SpellFilterScreen from '../../../src/features/spells/components/SpellFilterScreen';
import { applyFilters } from '../../../src/features/spells/services/spellFilterService';
import { getAllSpells } from '../../../src/features/spells/services/spellService';
import { useFilters } from '../../../src/features/spells/store/FilterContext';
import { FilterState } from '../../../src/features/spells/store/filterStore';

const ALL_SPELLS = getAllSpells();

export default function FiltersScreen() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();

  const resultCount = applyFilters(ALL_SPELLS, filters).length;

  function handleFiltersChange(newFilters: FilterState) {
    setFilters(newFilters);
  }

  function handleClose() {
    router.back();
  }

  return (
    <SpellFilterScreen
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClose={handleClose}
      resultCount={resultCount}
    />
  );
}