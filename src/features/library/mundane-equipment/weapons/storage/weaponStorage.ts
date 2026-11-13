import { getDatabase } from '@/src/shared/storage/storageClient';
import { Ammunition, AmmunitionDBRow, Weapon, WeaponDBRow, WeaponProperty, WeaponPropertyDBRow } from '../models/fiveE/Weapon';

export async function initWeaponTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS weapon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      cost INTEGER,
      damage TEXT,
      weight TEXT,
      properties TEXT,
      martial INTEGER,
      ranged INTEGER,
      moneyCost INTEGER,
      damageDie INTEGER,
      propertyList TEXT,
      search_vector TEXT
    );

    CREATE TABLE IF NOT EXISTS ammunition (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      amount INTEGER,
      cost TEXT,
      weight TEXT
    );
    
    CREATE TABLE IF NOT EXISTS weapon_property (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );
  `);
}

export async function saveWeapons(weapons: Weapon[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const weapon of weapons) {
      // 1. Insert core weapon attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO weapon (
          name, cost, damage, weight, properties, martial, ranged, money_cost, damage_die, propertyList
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          weapon.name,
          weapon.cost,
          weapon.damage,
          weapon.weight,
          weapon.properties,
          weapon.martial,
          weapon.ranged,
          weapon.moneyCost,
          weapon.damageDie,
          JSON.stringify(weapon.propertyList)
        ]
      );
    }
  });
}

export async function saveAmmunition(ammunitionList: Ammunition[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const ammunition of ammunitionList) {
      // 1. Insert core weapon attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO ammunition (
          name, amount, cost, weight
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ammunition.name,
          ammunition.amount,
          ammunition.cost,
          ammunition.weight
        ]
      );
    }
  });
}

export async function saveWeaponProperty(weaponProperties: WeaponProperty[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const weaponProperty of weaponProperties) {
      // 1. Insert core weapon attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO weapon_property (
          name, amount, cost, weight
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          weaponProperty.name,
          weaponProperty.description
        ]
      );
    }
  });
}

export async function loadWeaponsAll(): Promise<Weapon[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<WeaponDBRow>(`
    SELECT * FROM weapon
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      cost: row.cost,
      damage: row.damage,
      weight: row.weight,
      properties: row.properties,
      martial: row.martial === 1,
      ranged: row.ranged === 1,
      moneyCost: row.money_cost,
      damageDie: row.damage_die,
      propertyList: row.property_list ? JSON.parse(row.property_list) : [],
    };
  });
}

export async function loadWeaponById(id: number): Promise<Weapon | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<WeaponDBRow>(
    `SELECT * FROM weapon WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    cost: row.cost,
    damage: row.damage,
    weight: row.weight,
    properties: row.properties,
    martial: row.martial === 1,
    ranged: row.ranged === 1,
    moneyCost: row.money_cost,
    damageDie: row.damage_die,
    propertyList: row.property_list ? JSON.parse(row.property_list) : [],
  };
}

export async function loadAmmunitionAll(): Promise<Ammunition[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<AmmunitionDBRow>(`
    SELECT * FROM ammunition
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      amount: row.amount,
      cost: row.cost,
      weight: row.weight,
    };
  });
}

export async function loadAmmunitionById(id: number): Promise<Ammunition | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<AmmunitionDBRow>(
    `SELECT * FROM ammunition WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    cost: row.cost,
    weight: row.weight,
  };
}

export async function loadWeaponPropertyAll(): Promise<WeaponProperty[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<WeaponPropertyDBRow>(`
    SELECT * FROM weapon_property
  `);

  return rows.map(row => {

    return {
      id: row.id,
      name: row.name,
      description: row.description,
    };
  });
}

export async function loadWeaponPropertyById(id: number): Promise<WeaponProperty | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<WeaponPropertyDBRow>(
    `SELECT * FROM weapon WHERE id = ?`,
    [id]
  );

  if (!row) return null;


  return {
    id: row.id,
    name: row.name,
    description: row.description,
  };
}

export async function getWeaponCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM weapon');
  return result?.count ?? 0;
}

export async function getAmmunitionCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM ammunition');
  return result?.count ?? 0;
}

export async function getWeaponDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['weapon_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setWeaponDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['weapon_data_version', version.toString()]);
}

export async function getAmmunitionDataVersion(): Promise<number> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['ammunition_data_version']);
  return row ? parseInt(row.value) : 0;
}

export async function setAmmunitionDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['ammunition_data_version', version.toString()]);
}
