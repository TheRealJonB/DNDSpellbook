import { useLocalSearchParams, useRouter } from 'expo-router';
import CharacterSelectorScreen from '../../src/features/campaigns/components/CharacterSelectorScreen';
import { useCharacters } from '../../src/features/campaigns/store/CharacterContext';

export default function CharacterSelectorRoute() {
  const router = useRouter();
  const { spellNames } = useLocalSearchParams<{ spellNames: string }>();
  const { addSpells } = useCharacters();

  const parsedSpellNames: string[] = spellNames ? JSON.parse(spellNames) : [];

  async function handleConfirm(characterIds: string[]) {
    await addSpells(characterIds, parsedSpellNames);
    router.back();
  }

  return (
    <CharacterSelectorScreen
      key={spellNames || 'default'} // Forces React to unmount/remount the whole screen when spellNames change
      spellNames={parsedSpellNames}
      onConfirm={handleConfirm}
      onClose={() => router.back()}
    />
  );
}