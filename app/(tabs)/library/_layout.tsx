import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[spellId]" options={{ animation: 'slide_from_right' }} />
      {/* <Stack.Screen name="[magicItemId]" options={{ animation: 'slide_from_right' }} /> */}
      {/* <Stack.Screen name="[classId]" options={{ animation: 'slide_from_right' }} /> */}
    </Stack>
  );
}