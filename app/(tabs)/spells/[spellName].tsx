import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { getSpellByName } from '../../../src/features/spells/services/spellService';
import { colors } from '../../../src/shared/theme/colors';
import { typography } from '../../../src/shared/theme/typography';

export default function SpellDetailScreen() {
  const { spellName } = useLocalSearchParams<{ spellName: string }>();
  const spell = getSpellByName(decodeURIComponent(spellName ?? ''));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{spell?.name ?? 'Spell not found'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
  },
});