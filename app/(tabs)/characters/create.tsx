import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCharacters } from '../../../src/features/characters/store/CharacterContext';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

export default function CreateCharacterScreen() {
  const router = useRouter();
  const { createCharacter } = useCharacters();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    await createCharacter(name);
    router.back();
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>New Character</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Character name..."
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={text => { setName(text); setError(''); }}
          autoFocus
          autoCapitalize="words"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={handleCreate}
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
        >
          <Text style={styles.createButtonText}>Create Character</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  error: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.sm,
    padding: spacing.lg,
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
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
    borderRadius: 8,
    borderWidth: 0.5,
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    padding: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  placeholder: {
    width: 50,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});