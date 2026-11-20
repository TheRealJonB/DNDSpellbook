import { getDatabase } from '@/src/shared/storage/storageClient';
import { Lineage, LineageDBRow } from '../models/fiveE/Lineage';

export async function initLineageTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lineage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      source TEXT,
      skills TEXT,
      tools TEXT,
      lang TEXT,
      equip TEXT,
      skillProficiencies TEXT,
      toolProficiencies TEXT,
      languages TEXT,
      equipment TEXT,
      variants TEXT,
      features TEXT,
      suggestedCharacteristics TEXT
    );
  `);
}

export async function saveLineages(lineages: Omit<Lineage, 'id'>[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const lineage of lineages) {
      // 1. Insert core weapon attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO lineage (
          name, description, source, skills, tools, lang, equip, skillProficiencies,
          toolProficiencies, languages, equipment, variants, features, suggestedCharacteristics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lineage.name,
          lineage.source,
          JSON.stringify(lineage.descriptionTable),
          JSON.stringify(lineage.abilityScoreIncrease),
          JSON.stringify(lineage.age),
          JSON.stringify(lineage.alignment),
          JSON.stringify(lineage.size),
          JSON.stringify(lineage.speed),
          JSON.stringify(lineage.languages),
          JSON.stringify(lineage.features)
        ]
      );
    }
  });
}

export async function loadLineagesAll(): Promise<Lineage[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<LineageDBRow>(`
    SELECT * FROM lineage
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      source: row.source ?? null,
      descriptionTable: row.descriptionTable ? JSON.parse(row.descriptionTable) : null,
      abilityScoreIncrease: row.abilityScoreIncrease ? JSON.parse(row.abilityScoreIncrease) : null,
      age: row.age ? JSON.parse(row.age) : null,
      alignment: row.alignment ? JSON.parse(row.alignment) : null,
      size: row.size ? JSON.parse(row.size) : null,
      speed: row.speed ? JSON.parse(row.speed) : null,
      languages: row.languages ? JSON.parse(row.languages) : null,
      features: row.features ? JSON.parse(row.features) : null,
    };
  });
}

export async function loadLineageById(id: number): Promise<Lineage | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<LineageDBRow>(
    `SELECT * FROM lineage WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    source: row.source ?? null,
    descriptionTable: row.descriptionTable ? JSON.parse(row.descriptionTable) : null,
    abilityScoreIncrease: row.abilityScoreIncrease ? JSON.parse(row.abilityScoreIncrease) : null,
    age: row.age ? JSON.parse(row.age) : null,
    alignment: row.alignment ? JSON.parse(row.alignment) : null,
    size: row.size ? JSON.parse(row.size) : null,
    speed: row.speed ? JSON.parse(row.speed) : null,
    languages: row.languages ? JSON.parse(row.languages) : null,
    features: row.features ? JSON.parse(row.features) : null,
  };
}

export async function getLineageCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM lineage');
  return result?.count ?? 0;
}

export async function getLineageDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['lineage_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setLineageDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['lineage_data_version', version.toString()]);
}
