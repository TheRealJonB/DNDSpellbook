import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import {
  AOE_SHAPES, CASTING_TIMES,
  DAMAGE_TYPES,
  DURATIONS,
  SAVING_THROWS,
  SPELL_CLASSES,
  SPELL_LEVELS, SPELL_SCHOOLS
} from '../constants/filterOptions';
import { EMPTY_FILTERS, FilterState } from '../store/filterStore';

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

      {/* sticky header */}
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Filter Spells</Text>
        <Pressable onPress={() => onFiltersChange(EMPTY_FILTERS)}>
          <Text style={styles.clearText}>Clear all</Text>
        </Pressable>
      </View>

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

        {/* school */}
        <FilterSection title="School">
          <View style={styles.chipRow}>
            {SPELL_SCHOOLS.map(school => {
              const selected = filters.schools.includes(school);
              return (
                <Pressable
                  key={school}
                  onPress={() => onFiltersChange({ ...filters, schools: toggleArrayFilter(filters.schools, school) })}
                  style={[selected ? styles.chipSelected : styles.chip, { borderColor: selected ? colors.school[school] : colors.borderLight }]}
                >
                  <Text style={[selected ? styles.chipSelectedText : styles.chipText, { color: selected ? colors.school[school] : colors.textMuted }]}>
                    {school}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* class */}
        <FilterSection title="Class">
          <View style={styles.chipRow}>
            {SPELL_CLASSES.map(cls => {
              const selected = filters.classes.includes(cls);
              return (
                <Pressable
                  key={cls}
                  onPress={() => onFiltersChange({ ...filters, classes: toggleArrayFilter(filters.classes, cls) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{cls}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* casting time */}
        <FilterSection title="Casting Time">
          <View style={styles.chipRow}>
            {CASTING_TIMES.map(ct => {
              const selected = filters.castingTimes.includes(ct);
              return (
                <Pressable
                  key={ct}
                  onPress={() => onFiltersChange({ ...filters, castingTimes: toggleArrayFilter(filters.castingTimes, ct) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{ct}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* duration */}
        <FilterSection title="Duration">
          <View style={styles.chipRow}>
            {DURATIONS.map(dur => {
              const selected = filters.durations.includes(dur);
              return (
                <Pressable
                  key={dur}
                  onPress={() => onFiltersChange({ ...filters, durations: toggleArrayFilter(filters.durations, dur) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{dur}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* damage type */}
        <FilterSection title="Damage Type">
          <View style={styles.chipRow}>
            {DAMAGE_TYPES.map(dmg => {
              const selected = filters.damageTypes.includes(dmg);
              return (
                <Pressable
                  key={dmg}
                  onPress={() => onFiltersChange({ ...filters, damageTypes: toggleArrayFilter(filters.damageTypes, dmg) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{dmg}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* saving throw */}
        <FilterSection title="Saving Throw">
          <View style={styles.chipRow}>
            {SAVING_THROWS.map(save => {
              const selected = filters.savingThrows.includes(save);
              return (
                <Pressable
                  key={save}
                  onPress={() => onFiltersChange({ ...filters, savingThrows: toggleArrayFilter(filters.savingThrows, save) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{save}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* aoe shape */}
        <FilterSection title="AOE Shape">
          <View style={styles.chipRow}>
            {AOE_SHAPES.map(shape => {
              const selected = filters.aoeShapes.includes(shape);
              return (
                <Pressable
                  key={shape}
                  onPress={() => onFiltersChange({ ...filters, aoeShapes: toggleArrayFilter(filters.aoeShapes, shape) })}
                  style={selected ? styles.chipSelected : styles.chip}
                >
                  <Text style={selected ? styles.chipSelectedText : styles.chipText}>{shape}</Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* components */}
        <FilterSection title="Components">
          <View style={styles.chipRow}>
            <BooleanChip label="Verbal" value={filters.hasVerbal} onPress={() => onFiltersChange({ ...filters, hasVerbal: toggleBoolean(filters.hasVerbal) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
            <BooleanChip label="Somatic" value={filters.hasSomatic} onPress={() => onFiltersChange({ ...filters, hasSomatic: toggleBoolean(filters.hasSomatic) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
            <BooleanChip label="Material" value={filters.hasMaterial} onPress={() => onFiltersChange({ ...filters, hasMaterial: toggleBoolean(filters.hasMaterial) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
            <BooleanChip label="GP Cost" value={filters.materialCostContainsGP} onPress={() => onFiltersChange({ ...filters, materialCostContainsGP: toggleBoolean(filters.materialCostContainsGP) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
            <BooleanChip label="Consumed" value={filters.materialIsConsumed} onPress={() => onFiltersChange({ ...filters, materialIsConsumed: toggleBoolean(filters.materialIsConsumed) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
          </View>
        </FilterSection>

        {/* special */}
        <FilterSection title="Special">
          <View style={styles.chipRow}>
            <BooleanChip label="Spell Attack" value={filters.spellAttack} onPress={() => onFiltersChange({ ...filters, spellAttack: toggleBoolean(filters.spellAttack) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
            <BooleanChip label="Ritual" value={filters.ritual} onPress={() => onFiltersChange({ ...filters, ritual: toggleBoolean(filters.ritual) })} booleanLabel={booleanLabel} booleanStyle={booleanStyle} booleanTextStyle={booleanTextStyle} />
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