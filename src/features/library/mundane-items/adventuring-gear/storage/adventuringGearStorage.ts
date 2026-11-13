import { getDatabase } from '@/src/shared/storage/storageClient';
import { AdventuringGearGroup, AdventuringGearGroupDBRow } from '../models/fiveE/AdventuringGear';

export async function initAdventuringGearTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS adventuring_gear (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      table_header TEXT,
      gear_list TEXT,

      search_vector TEXT
    );
  `);
}

export async function saveAdventuringGear(adventuringGear: AdventuringGearGroup[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const gear of adventuringGear) {
      // 1. Insert core adventuring_gear attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO adventuring_gear (
          name, description, table_header, gearList
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          gear.name,
          JSON.stringify(gear.description),
          JSON.stringify(gear.tableHeader),
          JSON.stringify(gear.gearList)
        ]
      );
    }
  });
}

export async function loadAdventuringGearAll(): Promise<AdventuringGearGroup[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<AdventuringGearGroupDBRow>(`
    SELECT 
      id, name, description, table_header, gearList
    FROM adventuring_gear
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      description: JSON.parse(row.description),
      tableHeader: JSON.parse(row.table_header),
      gearList: JSON.parse(row.gearList),
    };
  });
}

export async function loadAdventuringGearByID(id: number): Promise<AdventuringGearGroup | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<AdventuringGearGroupDBRow>(
    `SELECT * FROM adventuring_gear WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    description: JSON.parse(row.description),
    tableHeader: JSON.parse(row.table_header),
    gearList: JSON.parse(row.gearList),
  };
}

export async function getAdventuringGearCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM adventuring_gear');
  return result?.count ?? 0;
}

export async function getAdventuringGearDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['adventuring_gear_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setAdventuringGearDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['adventuring_gear_data_version', version.toString()]);
}
