import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
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
}

export interface LibraryCategoryBottomSheetRef {
    open: () => void;
    close: () => void;
}

const LibraryCategoryBottomSheet = forwardRef<LibraryCategoryBottomSheetRef, LibraryCategoryBottomSheetProps>(({ sheetTitle, categories, onApplyCategory, currentCategory }, ref) => {0
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['90%'], []);

    // Expose specific functions to the parent component
    useImperativeHandle(ref, () => ({
        open: () => { bottomSheetRef.current?.expand(); },
        close: () => { bottomSheetRef.current?.close(); },
    }));

    const handleSelect = (value: string) => {
        onApplyCategory(value);
        bottomSheetRef.current?.close();
    }

    return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sheetHeader}>{sheetTitle}</Text>

        <View style={styles.listWrapper}>
          {/* Dynamically map out the categories */}
          {categories.map((item) => {
            const isSelected = item.value === currentCategory;

            return (
              <Pressable
                key={item.value}
                style={({ pressed }) => [
                  styles.categoryRow,
                  isSelected && styles.categoryRowSelected,
                  pressed && styles.categoryRowPressed,
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

LibraryCategoryBottomSheet.displayName = 'LibraryCategoryBottomSheet';
export default LibraryCategoryBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#1a1a1a', // Fits your dark theme
  },
  indicator: {
    backgroundColor: '#555',
  },
  scrollContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#fff',
  },
  listWrapper: {
    gap: spacing.sm, // Adds spacing between list rows natively
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
    backgroundColor: colors.accent || '#007AFF', // Use your theme color
    borderColor: colors.accent || '#007AFF',
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