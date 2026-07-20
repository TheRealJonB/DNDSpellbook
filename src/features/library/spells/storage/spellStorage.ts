import { getDatabase } from '@/src/shared/storage/storageClient';
import { SearchableSpell, Spell, SpellHeavyDetails } from '../models/fiveE/Spell';

export async function initSpellTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS spells (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      source TEXT,
      level INTEGER,
      school TEXT,
      casting_time TEXT,
      casting_time_abbr TEXT,
      ritual INTEGER,
      range TEXT,
      components TEXT,
      component_verbal INTEGER,
      component_somatic INTEGER,
      component_material INTEGER,
      component_gold_required INTEGER,
      component_gold_consumed INTEGER,
      duration TEXT,
      description TEXT,
      spell_attack INTEGER,
      upgrade TEXT
    );

    CREATE TABLE IF NOT EXISTS spell_damage_types (
      spell_id INTEGER NOT NULL,
      damage_type TEXT NOT NULL,
      PRIMARY KEY (spell_id, damage_type),
      FOREIGN KEY (spell_id) REFERENCES spells (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spell_saving_throws (
      spell_id INTEGER NOT NULL,
      saving_throw TEXT NOT NULL,
      PRIMARY KEY (spell_id, saving_throw),
      FOREIGN KEY (spell_id) REFERENCES spells (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spell_aoe_shapes (
      spell_id INTEGER NOT NULL,
      aoe_shape TEXT NOT NULL,
      PRIMARY KEY (spell_id, aoe_shape),
      FOREIGN KEY (spell_id) REFERENCES spells (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spell_dnd_classes (
      spell_id INTEGER NOT NULL,
      dnd_class TEXT NOT NULL,
      PRIMARY KEY (spell_id, dnd_class),
      FOREIGN KEY (spell_id) REFERENCES spells (id) ON DELETE CASCADE
    );
  `);
}

export async function saveSpells(spells: Spell[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const spell of spells) {
      // 1. Insert core spell attributes
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO spells (
          name, source, level, school, casting_time, casting_time_abbr,
          ritual, range, components, component_verbal, component_somatic, component_material, 
          component_gold_required, component_gold_consumed, duration, 
          description, spell_attack, upgrade
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          spell.name,
          spell.source,
          spell.level,
          spell.school,

          spell.castingTime,
          spell.castingTimeAbbr,
          spell.ritual ? 1 : 0,
          spell.range,
          spell.components,
          spell.componentVerbal ? 1 : 0,
          spell.componentSomatic ? 1 : 0,
          spell.componentMaterial ? 1 : 0,
          spell.componentGoldRequired ? 1 : 0,
          spell.componentGoldConsumed ? 1 : 0,
          spell.duration,

          JSON.stringify(spell.description),
          spell.spellAttack ? 1 : 0,

          spell.upgrade ?? null,
        ]
      );

      // Grab the database ID generated for this spell
      const spellId = result.lastInsertRowId;

      // Clean out old array entries to prevent duplicates during an "OR REPLACE" operation
      await db.runAsync('DELETE FROM spell_damage_types WHERE spell_id = ?', [spellId]);
      await db.runAsync('DELETE FROM spell_saving_throws WHERE spell_id = ?', [spellId]);
      await db.runAsync('DELETE FROM spell_aoe_shapes WHERE spell_id = ?', [spellId]);
      await db.runAsync('DELETE FROM spell_dnd_classes WHERE spell_id = ?', [spellId]);

      // 2. Populate normalized relational helper tables
      for (const damageType of spell.damageTypeArray) {
        await db.runAsync('INSERT INTO spell_damage_types (spell_id, damage_type) VALUES (?, ?)', [spellId, damageType]);
      }
      for (const savingThrow of spell.savingThrowArray) {
        await db.runAsync('INSERT INTO spell_saving_throws (spell_id, saving_throw) VALUES (?, ?)', [spellId, savingThrow]);
      }
      for (const aoeShape of spell.aoeShapeArray) {
        await db.runAsync('INSERT INTO spell_aoe_shapes (spell_id, aoe_shape) VALUES (?, ?)', [spellId, aoeShape]);
      }
      for (const dndClass of spell.dndClasses) {
        await db.runAsync('INSERT INTO spell_dnd_classes (spell_id, dnd_class) VALUES (?, ?)', [spellId, dndClass]);
      }
    }
  });
}

export async function loadSearchableSpells(): Promise<SearchableSpell[]> {
  const db = await getDatabase();

  // Load core table items
  const rows = await db.getAllAsync<Record<string, unknown>>(`
    SELECT 
      id, name, source, level, school, 
      casting_time_abbr, ritual, range, component_verbal, component_somatic, component_material, 
      component_gold_required, component_gold_consumed, 
      duration, spell_attack
    FROM spells
  `);

  // Pull all relations simultaneously in simple, indexed flat sweeps
  const allClasses = await db.getAllAsync<{ spell_id: number; dnd_class: string }>('SELECT * FROM spell_dnd_classes');
  const allDamage = await db.getAllAsync<{ spell_id: number; damage_type: string }>('SELECT * FROM spell_damage_types');
  const allSaves = await db.getAllAsync<{ spell_id: number; saving_throw: string }>('SELECT * FROM spell_saving_throws');
  const allShapes = await db.getAllAsync<{ spell_id: number; aoe_shape: string }>('SELECT * FROM spell_aoe_shapes');

  return rows.map(row => {
    const spellId = row.id as number;

    return {
      id: spellId,
      name: row.name as string,
      source: row.source as string,
      level: row.level as number,
      school: row.school as string,

      castingTimeAbbr: row.casting_time_abbr as string,
      ritual: row.ritual === 1,
      range: row.range as string,
      componentVerbal: row.component_verbal === 1,
      componentSomatic: row.component_somatic === 1,
      componentMaterial: row.component_material === 1,
      componentGoldRequired: row.component_gold_required === 1,
      componentGoldConsumed: row.component_gold_consumed === 1,
      duration: row.duration as string,

      damageTypeArray: allDamage.filter(d => d.spell_id === spellId).map(d => d.damage_type),
      savingThrowArray: allSaves.filter(s => s.spell_id === spellId).map(s => s.saving_throw),
      aoeShapeArray: allShapes.filter(a => a.spell_id === spellId).map(a => a.aoe_shape),
      spellAttack: row.spell_attack === 1,

      dndClasses: allClasses.filter(c => c.spell_id === spellId).map(c => c.dnd_class),

      // Filter the global arrays down to match this single spell item in memory
    };
  });
}

export async function loadSpellHeavyDetails(id: number): Promise<SpellHeavyDetails | null> {
  const db = await getDatabase();
  const spellHeavyDetails = await db.getFirstAsync<SpellHeavyDetails>(
    `SELECT casting_time AS castingTime, description, upgrade, components 
     FROM spells 
     WHERE id = ?`,
    [id]
  );
  return spellHeavyDetails || null;
}

export async function loadFullSpell(id: number): Promise<Spell | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM spells WHERE id = ?`,
    [id]
  );

  if (!row) return null;

  const spellId = row.id as number;

  const classes = await db.getAllAsync<{ dnd_class: string }>('SELECT dnd_class FROM spell_dnd_classes WHERE spell_id = ?', [spellId]);
  const damage = await db.getAllAsync<{ damage_type: string }>('SELECT damage_type FROM spell_damage_types WHERE spell_id = ?', [spellId]);
  const saves = await db.getAllAsync<{ saving_throw: string }>('SELECT saving_throw FROM spell_saving_throws WHERE spell_id = ?', [spellId]);
  const shapes = await db.getAllAsync<{ aoe_shape: string }>('SELECT aoe_shape FROM spell_aoe_shapes WHERE spell_id = ?', [spellId]);

  return {
    id: spellId,
    name: row.name as string,
    source: row.source as string,
    level: row.level as number,
    school: row.school as string,

    castingTime: row.casting_time as string,
    castingTimeAbbr: row.casting_time_abbr as string,
    ritual: row.ritual === 1,
    range: row.range as string,
    components: row.components as string,
    componentVerbal: row.component_verbal === 1,
    componentSomatic: row.component_somatic === 1,
    componentMaterial: row.component_material === 1,
    componentGoldRequired: row.component_gold_required === 1,
    componentGoldConsumed: row.component_gold_consumed === 1,
    duration: row.duration as string,

    description: JSON.parse(row.description as string) as string[],
    damageTypeArray: damage.map(d => d.damage_type),
    savingThrowArray: saves.map(s => s.saving_throw),
    aoeShapeArray: shapes.map(a => a.aoe_shape),
    spellAttack: row.spell_attack === 1,

    upgrade: row.upgrade as string | null,
    dndClasses: classes.map(c => c.dnd_class),
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
