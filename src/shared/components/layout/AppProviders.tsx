import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CharacterProvider } from '../../../features/campaigns/store/CharacterContext';

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <CharacterProvider>
          {children}
        </CharacterProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}