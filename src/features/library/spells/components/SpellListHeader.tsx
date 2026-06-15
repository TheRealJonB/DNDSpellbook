import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterActive: boolean;
  openFilterSheet: () => void;
}

export default function SpellListHeader(
  { searchQuery, onSearchChange, filterActive, openFilterSheet }: Props) {



  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backText}>huh?</Text>
      </Pressable>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={16}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search spells..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>
      <Pressable
        onPress={openFilterSheet}
        style={[styles.filterButton, filterActive && styles.filterButtonActive]}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={filterActive ? colors.accentLight : colors.textMuted}
        />
        {filterActive && <View style={styles.filterDot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backText: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
  },
  filterButton: {
    alignItems: 'center',
    borderColor: colors.borderLight,
    borderRadius: 8,
    borderWidth: 0.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  filterButtonActive: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  filterDot: {
    backgroundColor: colors.accentLight,
    borderRadius: 3,
    bottom: 6,
    height: 6,
    position: 'absolute',
    right: 6,
    width: 6,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
    borderRadius: 8,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 15,
  },
});