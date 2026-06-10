import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../../../src/shared/components/layout/ScreenContainer';
import { colors } from '../../../../src/shared/theme/colors';
import { typography } from '../../../../src/shared/theme/typography';

export default function ClassesScreen() {  // rename per file
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Coming Soon</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: colors.textMuted,
    fontSize: typography.sizes.lg,
  },
});