import { getDatabase } from '../../../shared/storage/storageClient';
import { Character } from '../models/Character';

export async function initCharacterTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      spell_names TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );
  `);
}

export async function saveCharacter(character: Character): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO characters (id, name, spell_names, created_at)
     VALUES (?, ?, ?, ?)`,
    [
      character.id,
      character.name,
      JSON.stringify(character.spellNames),
      character.createdAt,
    ]
  );
}

export async function loadCharacters(): Promise<Character[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM characters ORDER BY created_at ASC'
  );

  return rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    spellNames: JSON.parse(row.spell_names as string),
    createdAt: row.created_at as string,
  }));
}

export async function deleteCharacter(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM characters WHERE id = ?', [id]);
}

export async function addSpellsToCharacters(characterIds: string[], spellNames: string[]): Promise<void> {
  if (characterIds.length === 0) return;

  const db = await getDatabase();

  // 1. Generate placeholders (?, ?, ?) for the dynamic array of IDs
  const placeholders = characterIds.map(() => '?').join(',');

  // 2. Fetch all target characters in a single query
  const rows = await db.getAllAsync<{ id: string; spell_names: string }>(
    `SELECT id, spell_names FROM characters WHERE id IN (${placeholders})`, characterIds
  );

  // 3. Use a transaction to perform all updates in a single disk write
  await db.withTransactionAsync(async () => {
    // 4. Prepare the update statement once to reuse it efficiently
    const statement = await db.prepareAsync(
      'UPDATE characters SET spell_names = ? WHERE id = ?'
    );

    try {
      for (const row of rows) {
        const existingSpells: string[] = JSON.parse(row.spell_names || '[]');
        const toAdd = spellNames.filter(name => !existingSpells.includes(name));

        if (toAdd.length === 0) continue;

        const updated = [...existingSpells, ...toAdd];

        // Execute the prepared statement with the updated array
        await statement.executeAsync([JSON.stringify(updated), row.id]);
      }
    } finally {
      // Always finalize your prepared statements to prevent memory leaks
      await statement.finalizeAsync();
    }
  });
}

export async function removeSpellsFromCharacter(characterId: string, spellNames: string[]): Promise<void> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ spell_names: string }>(
    'SELECT spell_names FROM characters WHERE id = ?',
    [characterId]
  );
  if (!row) return;

  
  const newSpells: string[] = (JSON.parse(row.spell_names) as string[]).filter(n => !spellNames.includes(n));
  await db.runAsync(
    'UPDATE characters SET spell_names = ? WHERE id = ?',
    [JSON.stringify(newSpells), characterId]
  );
}
