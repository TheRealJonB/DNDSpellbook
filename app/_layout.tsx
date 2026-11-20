import { useInitializeSpellTable } from '@/src/features/library/spells/hooks/useSpellsData';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppProviders from '../src/shared/components/layout/AppProviders';
import { colors } from '../src/shared/theme/colors';

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
              <ActivityIndicator size="large" color={colors.accentLight} />
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});