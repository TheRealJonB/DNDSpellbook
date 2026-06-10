import ScreenContainer from '@/src/shared/components/layout/ScreenContainer';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useCharacters } from '../store/CharacterContext';

interface Props {
  spellNames: string[];
  onClose: () => void;
  onConfirm: (characterIds: string[]) => void;
}

export default function CharacterSelectorScreen({ spellNames, onClose, onConfirm }: Props) {
  const { characters } = useCharacters();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleCharacter(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    onConfirm(selectedIds);
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Add to Character</Text>
          <Pressable
            onPress={handleAdd}
            style={[styles.addButton, selectedIds.length === 0 && styles.addButtonDisabled]}
            disabled={selectedIds.length === 0}
          >
            <Text style={[styles.addButtonText, selectedIds.length === 0 && styles.addButtonTextDisabled]}>
              Add
            </Text>
          </Pressable>
        </View>

        {spellNames.length > 1 && (
          <View style={styles.spellCount}>
            <Text style={styles.spellCountText}>
              Adding {spellNames.length} spells
            </Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {characters.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No characters yet</Text>
              <Text style={styles.emptySubtext}>Create a character first</Text>
            </View>
          ) : (
            characters.map(character => {
              const isSelected = selectedIds.includes(character.id);
              const knownSpells = spellNames.filter(name =>
                character.spellNames.includes(name)
              );
              const hasConflict = knownSpells.length > 0;
              const allKnown = knownSpells.length === spellNames.length;

              return (
                <Pressable
                  key={character.id}
                  onPress={() => toggleCharacter(character.id)}
                  style={[
                    styles.characterRow,
                    isSelected && styles.characterRowSelected,
                  ]}
                >
                  <View style={styles.characterInfo}>
                    <Text style={styles.characterName}>{character.name}</Text>
                    {hasConflict && (
                      <Text style={styles.conflictWarning}>
                        {allKnown
                          ? `Already knows ${knownSpells.length === 1 ? 'this spell' : 'all these spells'}`
                          : `Already knows ${knownSpells.length} of these spells`
                        }
                      </Text>
                    )}
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonDisabled: {
    backgroundColor: colors.surfaceRaised,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  addButtonTextDisabled: {
    color: colors.textMuted,
  },
  cancelText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  characterInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  characterName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  characterRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  characterRowSelected: {
    backgroundColor: colors.chipSelected,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.borderLight,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxSelected: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentLight,
  },
  checkmark: {
    color: colors.background,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  conflictWarning: {
    color: colors.accentLight,
    fontSize: typography.sizes.xs,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
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
  spellCount: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  spellCountText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});