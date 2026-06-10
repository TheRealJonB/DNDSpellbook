import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CharacterProvider } from '../../../features/campaigns/store/CharacterContext';
import { SpellProvider } from '../../../features/library/store/SpellContext';

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <SafeAreaProvider>
      <SpellProvider>
        <CharacterProvider>
          {children}
        </CharacterProvider>
      </SpellProvider>
    </SafeAreaProvider>
  );
}