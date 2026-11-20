import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { radii, spacing } from '../spacing';
import { typography } from '../typography';

export const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: colors.surface,
    },
    sheetHeader: {
        color: colors.textPrimary,
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.lg,
    },
    optionList: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionRow: {
        alignSelf: 'flex-start',
        maxWidth: '100%',
        backgroundColor: colors.surfaceInteractive,
        borderColor: colors.borderStrong,
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    optionRowSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    optionText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
    },
    optionTextSelected: {
        color: colors.textOnAccent,
        fontWeight: typography.weights.bold,
    },
    pressablePressed: {
        opacity: 0.7,
    },

    applyButton: {
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
    },
    applyFilters: {
        color: colors.textPrimary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
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
        padding: spacing.xl,
        paddingBottom: spacing.xxxl,
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