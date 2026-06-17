import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const styles = StyleSheet.create({
    sheetHeader: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: '#111' 
    },
    groupContainer: { 
        marginBottom: 24 
    },
    groupTitle: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#666', 
        marginBottom: 12, 
        textTransform: 'uppercase' 
    },
    filterOptionsWrapper: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 8 
    },

    // Chip Styles
    filterOptionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterOptionChipPressed: {
        opacity: 0.7, // Replicating a slight fade, or you could do scale/color shifts
    },

    // Footer Button Styles
    footerButtons: { 
        marginTop: 16 
    },
    applyButtonPressed: {
        backgroundColor: '#0056b3', // Darkens the button slightly when actively pressed
    },

    

    applyButton: {
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: spacing.md,
    },
    applyFilters: {
        color: colors.textPrimary,
        fontSize: typography.sizes.lg,
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