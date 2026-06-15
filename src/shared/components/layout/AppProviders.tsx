import { ReactNode } from 'react';
import { CharacterProvider } from '../../../features/campaigns/store/CharacterContext';

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <CharacterProvider>
      {children}
    </CharacterProvider>
  );
}