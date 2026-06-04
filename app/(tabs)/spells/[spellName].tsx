import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getSpellByName } from '../../../src/features/spells/services/spellService';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';


export default function SpellDetailScreen() {
  const { spellName } = useLocalSearchParams<{ spellName: string }>();
  const router = useRouter();
  const spell = getSpellByName(decodeURIComponent(spellName ?? ''));

  if (!spell) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Spell not found</Text>
      </View>
    );
  }

  const schoolColor = colors.school[spell.school] ?? colors.accentLight;

  const levelLabel = spell.level === 0 ? `${spell.school} Cantrip` : `Level ${spell.level} ${spell.school}`;

  return (
    <ScreenContainer>
      <View style={styles.container}>

        {/* header */}
        <View style={[styles.header, { borderBottomColor: schoolColor }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.name}>{spell.name}</Text>
          <Text style={[styles.levelLabel, { color: schoolColor }]}>{levelLabel}</Text>
          <Text style={styles.source}>{spell.source}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* stat block */}
          <View style={styles.statBlock}>
            <StatRow label="Casting Time" value={spell.castingTime} />
            <StatRow label="Range" value={spell.range} />
            <StatRow label="Components" value={spell.components} />
            <StatRow label="Duration" value={spell.duration} />
          </View>

          {/* tags row */}
          <View style={styles.tagsRow}>
            {spell.hasVerbal && <Tag label="Verbal" />}
            {spell.hasSomatic && <Tag label="Somatic" />}
            {spell.hasMaterial && <Tag label="Material" />}
            {spell.hasMaterial && spell.materialCostContainsGP && <Tag label="GP Cost" />}
            {spell.hasMaterial && spell.materialIsConsumed && <Tag label="Consumed" />}
            {spell.spellAttack && <Tag label="Spell Attack" />}
            {spell.savingThrowArray.map(save => (
              <Tag key={save} label={`${save} Save`} />
            ))}
            {spell.aoeShapeArray.map(shape => (
              <Tag key={shape} label={shape} />
            ))}
            {spell.damageTypeArray.map(damage => (
              <Tag key={damage} label={damage} />
            ))}
          </View>

          {/* classes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Classes</Text>
            <Text style={styles.classesText}>{spell.classes.join(', ')}</Text>
          </View>

          {/* description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{spell.description}</Text>
          </View>

          {/* upgrade */}
          {spell.upgrade && (
            <View style={styles.upgradeBlock}>
              <Text style={styles.upgradeText}>{spell.upgrade}</Text>
            </View>
          )}

        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={statRowStyles.row}>
      <Text style={statRowStyles.label}>{label}</Text>
      <Text style={statRowStyles.value}>{value}</Text>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={[tagStyles.tag]}>
      <Text style={[tagStyles.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  classesText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
  header: {
    borderBottomWidth: 2,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  levelLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
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
  source: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  statBlock: {
    backgroundColor: colors.surface,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  upgradeBlock: {
    backgroundColor: colors.surfaceRaised,
    borderLeftColor: colors.accentLight,
    borderLeftWidth: 3,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    padding: spacing.md,
  },
  upgradeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});

const statRowStyles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    width: 110,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  value: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: typography.sizes.sm,
  },
});

const tagStyles = StyleSheet.create({
  tag: {
    borderColor: colors.borderLight,
    borderRadius: 4,
    borderWidth: 0.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
});