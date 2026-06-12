import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

interface Props {
  level: number;
  count: number;
  isExpanded: boolean;
  onToggle: (level: number) => void;
}

export function levelLabel(level: number): string {
  if (level === 0) return 'Cantrips';
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const suffix = suffixes[level] ?? 'th';
  return `${level}${suffix} Level`;
}

export default function SpellLevelSection({ level, count, isExpanded, onToggle }: Props) {
  return (
    <Pressable onPress={() => onToggle(level)} style={styles.header}>
      <Text style={styles.title}>{levelLabel(level)}</Text>
      <View style={styles.headerRight}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
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