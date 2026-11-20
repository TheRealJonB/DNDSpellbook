import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../../theme/components/bottomSheetStyles';


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
            backgroundStyle={styles.sheetBackground}
        //   handleIndicatorStyle={styles.indicator}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sheetHeader}>{sheetTitle}</Text>

                <View style={styles.optionList}>
                    {/* Dynamically map out the categories */}
                    {categories.map((item) => {
                        const isSelected = item.value === currentCategory;

                        return (
                            <Pressable
                                key={item.value}
                                style={({ pressed }) => [
                                    styles.optionRow,
                                    isSelected && styles.optionRowSelected,
                                    pressed && styles.pressablePressed,
                                ]}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
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