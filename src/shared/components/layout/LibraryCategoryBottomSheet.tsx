import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from '../../theme/components/bottomSheetStyles';
import { spacing } from '../../theme/spacing';


interface CategoryItem {
    label: string;
    value: string;
}

interface LibraryCategoryBottomSheetProps {
    sheetTitle: string;
    categories: CategoryItem[];
    onApplyCategory: (category: string) => void;
    currentCategory: string;
    topInset: number;
}

export interface LibraryCategoryBottomSheetRef {
    open: () => void;
    close: () => void;
}

const LibraryCategoryBottomSheet = forwardRef<LibraryCategoryBottomSheetRef, LibraryCategoryBottomSheetProps>(({ sheetTitle, categories, onApplyCategory, currentCategory, topInset }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['100%'], []);

    // Expose specific functions to the parent component
    useImperativeHandle(ref, () => ({
        open: () => { bottomSheetRef.current?.present(); },
        close: () => { bottomSheetRef.current?.close(); },
    }));

    const handleSelect = (value: string) => {
        onApplyCategory(value);
        bottomSheetRef.current?.close();
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

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            topInset={topInset}
            enableDynamicSizing={false}
        //   backgroundStyle={styles.sheetBackground}
        //   handleIndicatorStyle={styles.indicator}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sheetHeader}>{sheetTitle}</Text>

                <View style={categoryStyles.listWrapper}>
                    {/* Dynamically map out the categories */}
                    {categories.map((item) => {
                        const isSelected = item.value === currentCategory;

                        return (
                            <Pressable
                                key={item.value}
                                style={({ pressed }) => [
                                    categoryStyles.categoryRow,
                                    isSelected && categoryStyles.categoryRowSelected,
                                    pressed && categoryStyles.categoryRowPressed,
                                ]}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text
                                    style={[
                                        categoryStyles.categoryText,
                                        isSelected && categoryStyles.categoryTextSelected,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

LibraryCategoryBottomSheet.displayName = 'LibraryCategoryBottomSheet';
export default LibraryCategoryBottomSheet;

const categoryStyles = StyleSheet.create({
    listWrapper: {
        gap: spacing.sm,
    },
    categoryRow: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#333',
    },
    categoryRowSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    categoryRowPressed: {
        opacity: 0.7,
    },
    categoryText: {
        fontSize: 16,
        color: '#ccc',
    },
    categoryTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
});