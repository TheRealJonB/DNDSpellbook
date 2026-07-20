import { getDatabase } from '@/src/shared/storage/storageClient';
import { Feat, FeatDBRow, FeatHeavyDetails, ScrapedFeat, SearchableFeat } from '../models/fiveE/Feat';

export async function initFeatTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS feats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      source TEXT,
      prereq TEXT,
      abilityScoreIncreased TEXT,
      description TEXT,
      features_json TEXT,

      search_vector TEXT
    );
  `);
}

export async function saveFeats(feats: ScrapedFeat[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const feat of feats) {
      // 1. Insert core feats attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO feats (
          id, name, source, prereq, ability_score_increased, features_json, description_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          feat.name,
          feat.source,
          feat.prereq,
          JSON.stringify(feat.abilityScoreIncreased), // Converts string[] -> '["STR","DEX"]'
          JSON.stringify(feat.features),              // Converts Feature[] -> '[{"info":"...","table":...}]'
          JSON.stringify(feat.description)
        ]
      );
    }
  });
}

export async function loadSearchableFeats(): Promise<SearchableFeat[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<FeatDBRow>(`
    SELECT 
      id, name, source, prereq, ability_score_increased
    FROM feats
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      source: row.source,
      prereq: row.prereq,
      abilityScoreIncreased: JSON.parse(row.ability_score_increased),
      features: JSON.parse(row.features),
      description: JSON.parse(row.description),
    };
  });
}

export async function loadSpellHeavyDetails(id: number): Promise<FeatHeavyDetails | null> {
  const db = await getDatabase();
  const spellHeavyDetails = await db.getFirstAsync<FeatHeavyDetails>(
    `SELECT casting_time AS castingTime, description, upgrade, components 
     FROM spells 
     WHERE id = ?`,
    [id]
  );
  return spellHeavyDetails || null;
}

export async function loadFullFeat(id: number): Promise<Feat | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<FeatDBRow>(
    `SELECT * FROM feats WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    source: row.source,
    prereq: row.prereq,
    abilityScoreIncreased: JSON.parse(row.ability_score_increased),
    features: JSON.parse(row.features),
    description: JSON.parse(row.description)
  };
}

export async function getSpellCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM spells');
  return result?.count ?? 0;
}

export async function getSpellDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['spell_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setSpellDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['spell_data_version', version.toString()]);
}
