import CharacterCard from '@/src/features/campaigns/components/CharacterCard';
import { Character } from '@/src/features/campaigns/models/Character';
import { useCharacters } from '@/src/features/campaigns/store/CharacterContext';
import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import EmptyState from '@/src/shared/components/ui/EmptyState';
import LoadingSpinner from '@/src/shared/components/ui/LoadingSpinner';
import { colors } from '@/src/shared/theme/colors';
import { spacing } from '@/src/shared/theme/spacing';
import { typography } from '@/src/shared/theme/typography';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CharactersScreen() {
  const router = useRouter();
  const { characters, isLoading } = useCharacters();

  function handleCharacterPress(character: Character) {
    router.push(`/campaigns/${character.id}`); // FIX THIS
  }

  function handleCreatePress() {
    router.push('/campaigns/create'); // FIX THIS
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner message="Loading characters..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Characters</Text>
        <Pressable onPress={handleCreatePress} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New</Text>
        </Pressable>
      </View>
      <FlatList
        data={characters}
        keyExtractor={c => c.id}
        renderItem={({ item }) => (
          <CharacterCard character={item} onPress={handleCharacterPress} />
        )}
        ListEmptyComponent={
          <EmptyState
            message="No characters yet"
            subMessage="Tap + New to create your first character"
          />
        }
        contentContainerStyle={characters.length === 0 ? styles.emptyContainer : undefined}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderColor: colors.accentLight,
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  emptyContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});