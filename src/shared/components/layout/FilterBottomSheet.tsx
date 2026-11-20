import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../theme/components/bottomSheetStyles';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { FilterCategory } from '../../utils/filters';


interface FilterBottomSheetProps {
    filters: FilterCategory[];
    onApplyFilters: (finalFilters: FilterCategory[]) => void;
    topInset: number;
}

export interface FilterBottomSheetRef {
    open: () => void;
    close: () => void;
}

const FilterBottomSheet = forwardRef<FilterBottomSheetRef, FilterBottomSheetProps>(({ filters, onApplyFilters, topInset }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['100%'], []);

    const [localFilters, setLocalFilters] = useState<FilterCategory[]>(filters);
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);
    const handleToggleOption = (filterCategoryId: string, filterOptionId: string) => {
        const matchedCategory = localFilters.find((category) => category.id === filterCategoryId);
        const filterOption = matchedCategory?.filterOptions.find((option) => option.id === filterOptionId);

        if (!matchedCategory || !filterOption) {
            if (__DEV__) console.warn('[FilterBottomSheet] Cannot toggle an unknown filter option.', {
                filterCategoryId,
                filterOptionId,
            });
            return;
        }

        const updated = localFilters.map(category => {
            if (category.id !== filterCategoryId) return category;
            return {
                ...category,
                filterOptions: category.filterOptions.map(opt =>
                    opt.id === filterOptionId ? { ...opt, isSelected: !opt.isSelected } : opt
                )
            };
        });
        setLocalFilters(updated);
        if (__DEV__) {
            console.log('[FilterBottomSheet] Toggled filter option.', {
                category: matchedCategory.title,
                option: filterOption.label,
                isSelected: !filterOption.isSelected,
            });
        }
    }
    const handleClearFilters = () => {
        const updated = localFilters.map(filterCategory => {
            return {
                ...filterCategory,
                filterOptions: filterCategory.filterOptions.map(filterOption => ({
                    ...filterOption,
                    isSelected: false
                }))
            };
        })
        setLocalFilters(updated);
        if (__DEV__) console.log('[FilterBottomSheet] Cleared all local filters.');
    }

    const handleApplyFilters = () => {
        const selectedFilters = localFilters.flatMap((category) =>
            category.filterOptions
                .filter((option) => option.isSelected)
                .map((option) => ({ category: category.id, option: option.label }))
        );
        if (__DEV__) console.log('[FilterBottomSheet] Applying filters.', { selectedFilters });
        onApplyFilters(localFilters);
        bottomSheetRef.current?.close();
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // Keeps backdrop hidden when sheet is closed
                appearsOnIndex={0}      // Starts showing backdrop at first snap point
                opacity={0.5}          // How dark the background gets (0.0 to 1.0)
            />
        ),
        []
    );


    // Expose specific functions to the parent component
    useImperativeHandle(ref, () => ({
        open: () => { bottomSheetRef.current?.present(); },
        close: () => { bottomSheetRef.current?.close(); },
    }));

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            topInset={topInset}
            enableDynamicSizing={false}
            enablePanDownToClose={true}
        >

            {/* sticky header */}
            <View style={styles.header}>
                <Pressable onPress={() => bottomSheetRef.current?.close()} style={styles.closeButton}>
                    <Text style={styles.closeText}>← Back</Text>
                </Pressable>
                <Text style={styles.title}>Filter Spells</Text>
                <Pressable onPress={handleClearFilters}>
                    <Text style={styles.clearText}>Clear all</Text>
                </Pressable>
            </View>

            {/* Use BottomSheetScrollView so lists stay scrollable if they exceed 80% */}
            <BottomSheetScrollView
                contentContainerStyle={styles.scrollContent}
            >
                {/* 4. Dynamically loop over whatever filter groups are passed in */}
                {localFilters.map((filterCategory) => (
                    <View key={filterCategory.id} style={styles.section}>
                        <Text style={styles.sectionTitle}>{filterCategory.title}</Text>

                        <View style={styles.optionList}>
                            {/* Dynamically loop over changing filterOption items inside this specific group */}
                            {filterCategory.filterOptions.map((filterOption) => (
                                /* 2. Swapped to Pressable with a dynamic style function */
                                <Pressable
                                    key={filterOption.id}
                                    hitSlop={8} // Makes small chips easier to tap
                                    style={({ pressed }) => [
                                        styles.optionRow,
                                        filterOption.isSelected && styles.optionRowSelected,
                                        pressed && styles.pressablePressed,
                                    ]}
                                    onPress={() => handleToggleOption(filterCategory.id, filterOption.id)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filterOption.isSelected && styles.optionTextSelected,
                                        ]}
                                    >
                                        {filterOption.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                {/* ⚠️ CRITICAL STEP: Add a structural layout spacer here. 
          This forces the scroll container to add empty space at the bottom 
          so items can be scrolled high enough to clear your floating button layer. */}
                <View style={{ height: 100 }} />
            </BottomSheetScrollView>

            <View style={localFloatingStyles.floatingContainer} pointerEvents="box-none">
                <Pressable
                    style={({ pressed }) => [
                        styles.applyButton,
                        pressed && styles.pressablePressed,
                        localFloatingStyles.shadowEffect
                    ]}
                    onPress={handleApplyFilters}
                >
                    <Text style={styles.applyFilters}>Apply Filters</Text>
                </Pressable>
            </View>

        </BottomSheetModal>
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

const localFloatingStyles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.xl,
        paddingBottom: 100, // Adds padding for the phone's physical bottom indicator bar
        backgroundColor: 'transparent', // Keeps background transparent so content scrolls underneath visually
    },
    shadowEffect: {
        ...shadows.floating,
    }
});