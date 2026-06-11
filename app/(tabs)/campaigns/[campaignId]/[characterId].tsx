import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCharacters } from '../../../../src/features/campaigns/store/CharacterContext';
import SpellLevelSection from '../../../../src/features/library/spells/components/SpellLevelSection';
import { Spell } from '../../../../src/features/library/spells/models/Spell';
import { useSpells } from '../../../../src/features/library/spells/store/SpellContext';
import { groupSpellsByLevel } from '../../../../src/features/library/spells/utils/spellGrouping';
import EmptyState from '../../../../src/shared/components/ui/EmptyState';
import { colors } from '../../../../src/shared/theme/colors';
import { spacing } from '../../../../src/shared/theme/spacing';
import { typography } from '../../../../src/shared/theme/typography';


export default function CharacterDetailScreen() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const router = useRouter();
  const { getCharacterById, deleteCharacter } = useCharacters();
  const [showSpells, setShowSpells] = useState(true);
  const { spells: ALL_SPELLS } = useSpells();

  const character = getCharacterById(characterId ?? '');
  const characterSpells = character
    ? ALL_SPELLS.filter(s => character.spellNames.includes(s.name))
    : [];
  const groups = character ? groupSpellsByLevel(characterSpells) : [];

  if (!character) {
    return (
      <ScreenContainer>
        <EmptyState message="Character not found" />
      </ScreenContainer>
    );
  }

  function handleSpellPress(spell: Spell) {
    router.push(`/library/spells/${encodeURIComponent(spell.name)}`);
  }

  async function handleDelete() {
    if (!character) return;
    await deleteCharacter(character.id);
    router.back();
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{character.name}</Text>
        <Pressable onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{character.name}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => setShowSpells(prev => !prev)}
          style={styles.spellsHeader}
        >
          <View>
            <Text style={styles.sectionTitle}>Spell List</Text>
            <Text style={styles.spellCount}>
              {character.spellNames.length} {character.spellNames.length === 1 ? 'spell' : 'spells'}
            </Text>
          </View>
          <Text style={styles.chevron}>{showSpells ? '▲' : '▼'}</Text>
        </Pressable>

        // FIX THIS
        // will likely move this to its own screen that you get to from the character screen
        {showSpells && (
          groups.length === 0 ? (
            <View style={styles.emptySpells}>
              <EmptyState
                message="No spells yet"
                subMessage="Add spells from the spell list"
              />
            </View>
          ) : (
            groups.map(group => (
              <SpellLevelSection
                key={group.level}
                level={group.level}
                onSpellPress={handleSpellPress}
                spells={group.spells}
              />
            ))
          )
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  deleteText: {
    color: colors.error,
    fontSize: typography.sizes.sm,
  },
  emptySpells: {
    height: 200,
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
  infoLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    width: 80,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  infoValue: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
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
  spellCount: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  spellsHeader: {
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
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});