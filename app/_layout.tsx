import { useInitializeSpellTable } from '@/src/features/library/spells/hooks/useSpellsData';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppProviders from '../src/shared/components/layout/AppProviders';

export default function RootLayout() {
  const { isLibraryReady } = useInitializeSpellTable();

  return (
    <SafeAreaProvider>
      <AppProviders>
        {isLibraryReady ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>

        ) : (
          // make this loading spinner better
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>

        )}
      </AppProviders>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // Blocks the user from seeing or clicking uninitialized tabs
    justifyContent: 'center',
    alignItems: 'center',
  },
});