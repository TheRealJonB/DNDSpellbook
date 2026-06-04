import { Stack } from 'expo-router';
import { FilterProvider } from '../../../src/features/spells/store/FilterContext';

export default function SpellsLayout() {
  return (
    <FilterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="filters" />
        <Stack.Screen name="[spellName]" />
      </Stack>
    </FilterProvider>
  );
}