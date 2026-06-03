import { useLocalSearchParams, useRouter } from 'expo-router';
import SpellFilterScreen from '../../../src/features/spells/components/SpellFilterScreen';
import { applyFilters } from '../../../src/features/spells/services/spellFilterService';
import { getAllSpells } from '../../../src/features/spells/services/spellService';
import { FilterState } from '../../../src/features/spells/store/filterStore';

export default function FiltersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters: string }>();
  const filters: FilterState = params.filters ? JSON.parse(params.filters) : {};

  const allSpells = getAllSpells();
  const resultCount = applyFilters(allSpells, filters).length;

  function handleFiltersChange(newFilters: FilterState) {
    router.setParams({ filters: JSON.stringify(newFilters) });
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