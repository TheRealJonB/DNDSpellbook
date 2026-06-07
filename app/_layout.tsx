import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CharacterProvider } from '../src/features/characters/store/CharacterContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CharacterProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </CharacterProvider>
    </SafeAreaProvider>
  );
}