import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CharacterProvider } from '../../../features/campaigns/store/CharacterContext';

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <SafeAreaProvider>
      <CharacterProvider>
        {children}
      </CharacterProvider>
    </SafeAreaProvider>
  );
}