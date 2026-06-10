import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../../src/shared/components/layout/ScreenContainer';
import { colors } from '../../../src/shared/theme/colors';
import { spacing } from '../../../src/shared/theme/spacing';
import { typography } from '../../../src/shared/theme/typography';

const CONTENT_TYPES = [
  {
    key: 'spells',
    label: 'Spells',
    description: 'Browse all spells',
    available: true,
  },
  {
    key: 'magic-items',
    label: 'Magic Items',
    description: 'Coming soon',
    available: false,
  },
  {
    key: 'species',
    label: 'Species',
    description: 'Coming soon',
    available: false,
  },
  {
    key: 'classes',
    label: 'Classes',
    description: 'Coming soon',
    available: false,
  },
] as const;

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {CONTENT_TYPES.map(content => (
          <Pressable
            key={content.key}
            onPress={() => content.available
              ? router.push(`/(tabs)/library/${content.key}`)
              : null
            }
            style={({ pressed }) => [
              styles.card,
              pressed && content.available && styles.cardPressed,
              !content.available && styles.cardDisabled,
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[
                styles.cardTitle,
                !content.available && styles.cardTitleDisabled,
              ]}>
                {content.label}
              </Text>
              <Text style={styles.cardDescription}>{content.description}</Text>
            </View>
            {content.available && (
              <Text style={styles.chevron}>›</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs,
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  cardTitleDisabled: {
    color: colors.textSecondary,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xl,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
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