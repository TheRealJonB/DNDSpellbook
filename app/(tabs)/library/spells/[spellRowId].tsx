import { Spell } from '@/src/features/library/spells/models/Spell';
import { getSpellHeavyDetails } from '@/src/features/library/spells/services/spellSyncService';
import { useSpells } from '@/src/features/library/spells/store/SpellContext';
import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import LoadingSpinner from '@/src/shared/components/ui/LoadingSpinner';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../src/shared/theme/colors';
import { spacing } from '../../../../src/shared/theme/spacing';
import { typography } from '../../../../src/shared/theme/typography';



export default function SpellDetailScreen() {
  const router = useRouter();
  const { lightSpells, isLoading } = useSpells();
  const { spellRowId } = useLocalSearchParams<{ spellRowId: string }>();


  const [spell, setSpell] = useState<Spell | null>(null);
  const [isHeavyLoading, setIsHeavyLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpellData() {
      if (!spellRowId) return;

      const spellId = Number(spellRowId);
      const lightSpell = lightSpells.find(s => s.rowid === spellId);

      if (!lightSpell) return;

      try {
        const heavyDetails = await getSpellHeavyDetails(spellId);

        if (heavyDetails) {
          setSpell({
            ...lightSpell,
            ...heavyDetails,
          });
        }
      } catch (error) {
        console.error('Failed to load heavy spell text', error);
        setError('Failed to load spell.');
      } finally {
        setIsHeavyLoading(false);
      }
    }
    loadSpellData();
  }, [spellRowId, lightSpells]);

  if (isLoading || isHeavyLoading) {
    return (
      <ScreenContainer>
        <LoadingSpinner message="Loading spell..." />
      </ScreenContainer>
    );
  }

  if (!spell) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Spell not found</Text>
      </View>
    );
  }


  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>There was an error</Text>
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
          <Pressable
            onPress={() => router.push({
              pathname: '../character-selector',
              params: { spellNames: JSON.stringify([spell.name]) },
            })}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add to Character</Text>
          </Pressable>
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
            {spell.componentVerbal && <Tag label="Verbal" />}
            {spell.componentSomatic && <Tag label="Somatic" />}
            {spell.componentMaterial && <Tag label="Material" />}
            {spell.componentMaterial && spell.componentGoldRequired && <Tag label="GP Cost" />}
            {spell.componentMaterial && spell.componentGoldConsumed && <Tag label="Consumed" />}
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
  addButton: {
    borderColor: colors.borderLight,
    borderRadius: 6,
    borderWidth: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
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