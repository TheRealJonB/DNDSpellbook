import { Stack } from 'expo-router';

export default function SpellsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="filters" />
      <Stack.Screen name="[spellRowId]" />
    </Stack>
  );
}