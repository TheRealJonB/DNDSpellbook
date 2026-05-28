import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchAllSpells } from '../../src/features/spells/api/spellApi';

export default function SpellsScreen() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetchAllSpells()
      .then(spells => setStatus(`Success — ${spells.length} spells loaded`))
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