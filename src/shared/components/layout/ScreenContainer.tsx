import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenContainer({ children, style }: Props) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});