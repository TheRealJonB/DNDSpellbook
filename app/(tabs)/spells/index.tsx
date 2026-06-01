import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SpellLevelSection from '../../../src/features/spells/components/SpellLevelSection';
import { Spell } from '../../../src/features/spells/models/Spell';
import { getAllSpells } from '../../../src/features/spells/services/spellService';
import { groupSpellsByLevel, SpellGroup } from '../../../src/features/spells/utils/spellGrouping';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import EmptyState from '../../../src/shared/components/ui/EmptyState';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

export default function SpellsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<SpellGroup[]>([]);
  const [spellCount, setSpellCount] = useState(0);

  useEffect(() => {
    const spells = getAllSpells();
    setSpellCount(spells.length);
    setGroups(groupSpellsByLevel(spells));
  }, []);

  function handleSpellPress(spell: Spell) {
    router.push(`/spells/${encodeURIComponent(spell.name)}`);
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Spells</Text>
        <Text style={styles.count}>{spellCount} spells</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <EmptyState message="No spells found" />
        ) : (
          groups.map(group => (
            <SpellLevelSection
              key={group.level}
              level={group.level}
              onSpellPress={handleSpellPress}
              spells={group.spells}
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  count: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  header: {
    alignItems: 'baseline',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});