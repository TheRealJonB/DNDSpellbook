import { getDatabase } from '@/src/shared/storage/storageClient';
import { Armor, ArmorDBRow } from '../models/fiveE/Armor';

export async function initArmorTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS armor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      armor_class TEXT,
      strReq TEXT,
      stealth TEXT,
      weight TEXT,
      cost TEXT,
      armorType TEXT,

      search_vector TEXT
    );

    CREATE TABLE IF NOT EXISTS don_doff_time (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      armorCategory TEXT UNIQUE NOT NULL,
      don TEXT,
      doff TEXT
    );
    
    CREATE TABLE IF NOT EXISTS armor_proficiency (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );
  `);
}

export async function saveArmor(armors: Armor[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const armor of armors) {
      // 1. Insert core armor attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO armor (
          name, armor_class, str_req, stealth, weight, cost, armor_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          armor.name,
          armor.armorClass,
          armor.strReq,
          armor.stealth,
          armor.weight,
          armor.cost,
          armor.armorType
        ]
      );
    }
  });
}

export async function loadArmorAll(): Promise<Armor[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<ArmorDBRow>(`
    SELECT 
      id, name, armor_class, str_req, stealth, weight, cost, armor_type
    FROM armor
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      armorClass: row.armor_class,
      strReq: row.str_req,
      stealth: row.stealth,
      weight: row.weight,
      cost: row.cost,
      armorType: row.armor_type,
    };
  });
}

export async function loadArmorById(id: number): Promise<Armor | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ArmorDBRow>(
    `SELECT * FROM armor WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    armorClass: row.armor_class,
    strReq: row.str_req,
    stealth: row.stealth,
    weight: row.weight,
    cost: row.cost,
    armorType: row.armor_type,
  };
}

export async function getArmorCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM armor');
  return result?.count ?? 0;
}

export async function getArmorDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['armor_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setArmorDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['armor_data_version', version.toString()]);
}
