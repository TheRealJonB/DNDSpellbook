import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { FilterCategory } from '../../types/filters';


interface FilterBottomSheetProps {
    sheetTitle: string;
    filters: FilterCategory[];
    onApplyFilters: (finalFilters: FilterCategory[]) => void;
}

export interface FilterBottomSheetRef {
    open: () => void;
    close: () => void;
}

const FilterBottomSheet = forwardRef<FilterBottomSheetRef, FilterBottomSheetProps>(({ sheetTitle, filters, onApplyFilters }, ref) => {
    const [localFilters, setLocalFilters] = useState<FilterCategory[]>(filters);
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);
    const handleToggleOption = (groupId: string, optionId: string) => {
        const updated = localFilters.map(group => {
            if (group.id !== groupId) return group;
            return {
                ...group,
                options: group.options.map(opt => 
                    opt.id === optionId ? { ...opt, isSelected: !opt.isSelected } : opt
                )
            };
        });
        setLocalFilters(updated);
    }
    
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['80%'], []);

    // Expose specific functions to the parent component
    useImperativeHandle(ref, () => ({
        open: () => {
            bottomSheetRef.current?.expand();
        },
        close: () => {
            bottomSheetRef.current?.close();
        },
    }));

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
        >
            {/* Use BottomSheetScrollView so lists stay scrollable if they exceed 80% */}
            <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sheetHeader}>{sheetTitle}</Text>

                {/* 4. Dynamically loop over whatever filter groups are passed in */}
                {localFilters.map((group) => (
                    <View key={group.id} style={styles.groupContainer}>
                        <Text style={styles.groupTitle}>{group.title}</Text>

                        <View style={styles.optionsWrapper}>
                            {/* Dynamically loop over changing option items inside this specific group */}
                            {group.options.map((option) => (
                                /* 2. Swapped to Pressable with a dynamic style function */
                                <Pressable
                                    key={option.id}
                                    hitSlop={8} // Makes small chips easier to tap
                                    style={({ pressed }) => [
                                        styles.optionChip,
                                        option.isSelected && styles.optionChipSelected,
                                        pressed && styles.optionChipPressed, // Custom active feedback
                                    ]}
                                    onPress={() => handleToggleOption(group.id, option.id)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            option.isSelected && styles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.footerButtons}>
                    <Pressable
                        style={styles.applyButton}
                        onPress={() => {
                            onApplyFilters(localFilters);
                            bottomSheetRef.current?.close();
                        }}
                    >
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </Pressable>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}
);


function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
}

FilterBottomSheet.displayName = 'FilterBottomSheet';
export default FilterBottomSheet;

const styles = StyleSheet.create({
    scrollContainer: { padding: 24, paddingBottom: 40 },
    sheetHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#111' },
    groupContainer: { marginBottom: 24 },
    groupTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 12, textTransform: 'uppercase' },
    optionsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    // Chip Styles
    optionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    optionChipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    optionChipPressed: {
        opacity: 0.7, // Replicating a slight fade, or you could do scale/color shifts
    },
    optionText: { fontSize: 14, color: '#333' },
    optionTextSelected: { color: '#fff', fontWeight: '600' },

    // Footer Button Styles
    footerButtons: { marginTop: 16 },

    applyButtonPressed: {
        backgroundColor: '#0056b3', // Darkens the button slightly when actively pressed
    },
    applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    applyButton: {
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: spacing.md,
    },
    applyText: {
        color: colors.textPrimary,
        fontSize: typography.sizes.md,
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
        paddingBottom: spacing.xl,
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