import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeSpells } from '../../src/features/spells/services/spellSyncService';

export default function SpellsScreen() {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    initializeSpells()
      .then(spells => setStatus(`Loaded ${spells.length} spells from ${spells[0]?.source ?? 'unknown'}`))
      .catch(err => setStatus(`Error: ${err.message}`));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  text: { color: '#fff', fontSize: 16, textAlign: 'center', padding: 24 },
});