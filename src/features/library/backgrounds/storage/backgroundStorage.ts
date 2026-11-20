import { getDatabase } from '@/src/shared/storage/storageClient';
import { Background, BackgroundDBRow } from '../models/fiveE/Background';

export async function initBackgroundTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS background (
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

export async function saveBackgrounds(backgrounds: Omit<Background, 'id'>[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const background of backgrounds) {
      // 1. Insert core weapon attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO background (
          name, description, source, skills, tools, lang, equip, skillProficiencies,
          toolProficiencies, languages, equipment, variants, features, suggestedCharacteristics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          background.name,
          JSON.stringify(background.description),
          background.source,
          background.skills,
          background.tools,
          background.lang,
          background.equip,
          JSON.stringify(background.skillProficiencies),
          JSON.stringify(background.toolProficiencies),
          JSON.stringify(background.languages),
          JSON.stringify(background.equipment),
          JSON.stringify(background.variants),
          JSON.stringify(background.features),
          JSON.stringify(background.suggestedCharacteristics)
        ]
      );
    }
  });
}

export async function loadBackgroundsAll(): Promise<Background[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<BackgroundDBRow>(`
    SELECT * FROM background
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      description: row.description ? JSON.parse(row.description) : [],
      source: row.source ?? '',
      skills: row.skills ?? '',
      tools: row.tools ?? '',
      lang: row.lang ?? '',
      equip: row.equip ?? '',
      skillProficiencies: row.skillProficiencies ? JSON.parse(row.skillProficiencies) : null,
      toolProficiencies: row.toolProficiencies ? JSON.parse(row.toolProficiencies) : null,
      languages: row.languages ? JSON.parse(row.languages) : null,
      equipment: row.equipment ? JSON.parse(row.equipment) : null,
      variants: row.variants ? JSON.parse(row.variants) : null,
      features: row.features ? JSON.parse(row.features) : null,
      suggestedCharacteristics: row.suggestedCharacteristics ? JSON.parse(row.suggestedCharacteristics) : null,
    };
  });
}

export async function loadBackgroundById(id: number): Promise<Background | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<BackgroundDBRow>(
    `SELECT * FROM background WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    description: row.description ? JSON.parse(row.description) : [] ,
    source: row.source ?? '',
    skills: row.skills ?? '',
    tools: row.tools ?? '',
    lang: row.lang ?? '',
    equip: row.equip ?? '',
    skillProficiencies: row.skillProficiencies ? JSON.parse(row.skillProficiencies) : null,
    toolProficiencies: row.toolProficiencies ? JSON.parse(row.toolProficiencies) : null,
    languages: row.languages ? JSON.parse(row.languages) : null,
    equipment: row.equipment ? JSON.parse(row.equipment) : null,
    variants: row.variants ? JSON.parse(row.variants) : null,
    features: row.features ? JSON.parse(row.features) : null,
    suggestedCharacteristics: row.suggestedCharacteristics ? JSON.parse(row.suggestedCharacteristics) : null,
  };
}

export async function getBackgroundCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM background');
  return result?.count ?? 0;
}

export async function getBackgroundDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['background_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setBackgroundDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['background_data_version', version.toString()]);
}
