import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { Spell } from '../models/Spell';
import SpellCard from './SpellCard';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  level: number;
  onSpellPress: (spell: Spell) => void;
  spells: Spell[];
}

function levelLabel(level: number): string {
  if (level === 0) return 'Cantrips';
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const suffix = suffixes[level] ?? 'th';
  return `${level}${suffix} Level`;
}

export default function SpellLevelSection({ level, onSpellPress, spells }: Props) {
  const [expanded, setExpanded] = useState(true);

  function handleToggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <Text style={styles.title}>{levelLabel(level)}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.count}>{spells.length}</Text>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>
      {expanded && (
        <View>
          {spells.map(spell => (
            <SpellCard
              key={spell.name}
              onPress={onSpellPress}
              spell={spell}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  container: {
    marginBottom: spacing.xs,
  },
  count: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});