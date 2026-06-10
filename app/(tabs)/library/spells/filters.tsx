import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { useRouter } from 'expo-router';
import SpellFilterScreen from '../../../../src/features/library/components/SpellFilterScreen';
import { applyFilters } from '../../../../src/features/library/spells/services/spellFilterService';
import { useFilters } from '../../../../src/features/library/store/FilterContext';
import { FilterState } from '../../../../src/features/library/store/filterStore';
import { useSpells } from '../../../../src/features/library/store/SpellContext';


export default function FiltersScreen() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();
  const { spells: ALL_SPELLS } = useSpells();

  const resultCount = applyFilters(ALL_SPELLS, filters).length;

  function handleFiltersChange(newFilters: FilterState) {
    setFilters(newFilters);
  }

  function handleClose() {
    router.back();
  }

  return (
    <ScreenContainer>
      <SpellFilterScreen
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClose={handleClose}
        resultCount={resultCount}
      />
    </ScreenContainer>
  );
}