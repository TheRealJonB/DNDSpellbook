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

export async function addSpellToCharacter(characterId: string, spellName: string): Promise<void> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ spell_names: string }>(
    'SELECT spell_names FROM characters WHERE id = ?',
    [characterId]
  );
  if (!row) return;

  const spellNames: string[] = JSON.parse(row.spell_names);
  if (spellNames.includes(spellName)) return;

  spellNames.push(spellName);
  await db.runAsync(
    'UPDATE characters SET spell_names = ? WHERE id = ?',
    [JSON.stringify(spellNames), characterId]
  );
}

export async function removeSpellFromCharacter(characterId: string, spellName: string): Promise<void> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ spell_names: string }>(
    'SELECT spell_names FROM characters WHERE id = ?',
    [characterId]
  );
  if (!row) return;

  const spellNames: string[] = (JSON.parse(row.spell_names) as string[]).filter(n => n !== spellName);
  await db.runAsync(
    'UPDATE characters SET spell_names = ? WHERE id = ?',
    [JSON.stringify(spellNames), characterId]
  );
}