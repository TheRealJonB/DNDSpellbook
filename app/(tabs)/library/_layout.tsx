import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="spells" />
      <Stack.Screen name="magic-items" />
      <Stack.Screen name="species" />
      <Stack.Screen name="classes" />
    </Stack>
  );
}