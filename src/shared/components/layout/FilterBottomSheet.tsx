import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../theme/components/bottomSheetStyles';
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
        const updated = localFilters.map(filterCategory => {
            if (filterCategory.id !== filterCategoryId) return filterCategory;
            return {
                ...filterCategory,
                filterOptionId: filterCategory.filterOptions.map(opt =>
                    opt.id === filterOptionId ? { ...opt, isSelected: !opt.isSelected } : opt
                )
            };
        });
        setLocalFilters(updated);
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
    }

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
                {localFilters.map((group) => (
                    <View key={group.id} style={styles.section}>
                        <Text style={styles.sectionTitle}>{group.title}</Text>

                        <View style={styles.chipRow}>
                            {/* Dynamically loop over changing filterOption items inside this specific group */}
                            {group.filterOptions.map((filterOption) => (
                                /* 2. Swapped to Pressable with a dynamic style function */
                                <Pressable
                                    key={filterOption.id}
                                    hitSlop={8} // Makes small chips easier to tap
                                    style={({ pressed }) => [
                                        styles.chip,
                                        filterOption.isSelected && styles.chipSelected,
                                        pressed && styles.filterOptionChipPressed, // Custom active feedback
                                    ]}
                                    onPress={() => handleToggleOption(group.id, filterOption.id)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            filterOption.isSelected && styles.chipSelectedText,
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
                        pressed && styles.applyButtonPressed,
                        localFloatingStyles.shadowEffect
                    ]}
                    onPress={() => {
                        onApplyFilters(localFilters);
                        bottomSheetRef.current?.close();
                    }}
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
        paddingHorizontal: 24,
        paddingBottom: 100, // Adds padding for the phone's physical bottom indicator bar
        backgroundColor: 'transparent', // Keeps background transparent so content scrolls underneath visually
    },
    shadowEffect: {
        // Elevates the floating pill card visually over your scrolling chips
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8, // Required for shadow depth handling on Android devices
    }
});