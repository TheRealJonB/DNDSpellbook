import { Stack } from 'expo-router';
import { FilterProvider } from '../../../src/features/library/spells/store/FilterContext';

export default function LibraryLayout() {
  return (
    <FilterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="spells" />
        <Stack.Screen name="magic-items" />
        <Stack.Screen name="species" />
        <Stack.Screen name="classes" />
      </Stack>
    </FilterProvider>
  );
}