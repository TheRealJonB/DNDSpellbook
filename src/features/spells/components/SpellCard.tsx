import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { Spell } from '../models/Spell';

interface Props {
  onPress: (spell: Spell) => void;
  spell: Spell;
}

export default function SpellCard({ onPress, spell }: Props) {
  const schoolColor = colors.school[spell.school] ?? colors.accentLight;

  return (
    <Pressable
      onPress={() => onPress(spell)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.schoolBar, { backgroundColor: schoolColor }]} />
      <View style={styles.content}>
        <Text style={styles.name}>{spell.name}</Text>
        <View style={styles.tags}>
          {spell.spellAttack && (
            <Text style={styles.tag}>Attack</Text>
          )}
          {spell.savingThrowArray.length > 0 && (
            <Text style={styles.tag}>{spell.savingThrowArray[0]} Save</Text>
          )}
          {spell.aoeShapeArray.length > 0 && (
            <Text style={styles.tag}>{spell.aoeShapeArray[0]}</Text>
          )}
          {spell.damageTypeArray.length > 0 && (
            <Text style={[styles.tag, styles.damageTag]}>
              {spell.damageTypeArray[0]}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.castingTime}>{spell.castingTimeAbbr}</Text>
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
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
  },
  castingTime: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    maxWidth: 70,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  damageTag: {
    borderColor: colors.accentLight,
    color: colors.accentLight,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  pressed: {
    opacity: 0.7,
  },
  schoolBar: {
    borderRadius: 2,
    height: '80%',
    width: 3,
  },
  tag: {
    borderColor: colors.borderLight,
    borderRadius: 4,
    borderWidth: 0.5,
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});