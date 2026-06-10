import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { Character } from '../models/Character';

interface Props {
  character: Character;
  onPress: (character: Character) => void;
}

export default function CharacterCard({ character, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(character)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.spellCount}>
          {character.spellNames.length} {character.spellNames.length === 1 ? 'spell' : 'spells'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xl,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  pressed: {
    opacity: 0.7,
  },
  spellCount: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
});