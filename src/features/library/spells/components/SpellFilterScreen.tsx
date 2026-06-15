import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { FilterState } from '../store/filterStore';

interface Props {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
  resultCount: number;
}

export default function SpellFilterScreen({ filters, onFiltersChange, onClose, resultCount }: Props) {

  function toggleArrayFilter<T>(array: T[], value: T): T[] {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  }

  function toggleBoolean(current: boolean | null): boolean | null {
    if (current === null) return true;
    if (current === true) return false;
    return null;
  }

  function booleanLabel(current: boolean | null): string {
    if (current === null) return 'Any';
    if (current === true) return 'Yes';
    return 'No';
  }

  function booleanStyle(current: boolean | null) {
    return current !== null ? styles.chipSelected : styles.chip;
  }

  function booleanTextStyle(current: boolean | null) {
    return current !== null ? styles.chipSelectedText : styles.chipText;
  }

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* level */}
        <FilterSection title="Level">
          <View style={styles.chipRow}>
            {SPELL_LEVELS.map(({ label, value }) => {
              const selected = filters.levels.includes(value);
              return (
                <Pressable
                  key={value}
                  onPress={() => onFiltersChange({ ...filters, levels: toggleArrayFilter(filters.levels, value) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

      </ScrollView>

      {/* sticky footer */}
      <View style={styles.footer}>
        <Pressable onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyText}>Show {resultCount} spells</Text>
        </Pressable>
      </View>

    </View>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BooleanChip({ label, value, onPress, booleanLabel, booleanStyle, booleanTextStyle }: {
  label: string;
  value: boolean | null;
  onPress: () => void;
  booleanLabel: (v: boolean | null) => string;
  booleanStyle: (v: boolean | null) => object;
  booleanTextStyle: (v: boolean | null) => object;
}) {
  return (
    <Pressable onPress={onPress} style={booleanStyle(value)}>
      <Text style={booleanTextStyle(value)}>{label}: {booleanLabel(value)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: spacing.md,
  },
  applyText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  chip: {
    borderColor: colors.borderLight,
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelectedText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  clearText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  closeButton: {},
  closeText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});