import { getDatabase } from '@/src/shared/storage/storageClient';
import { LightSpell, Spell, SpellHeavyDetails } from '../models/Spell';

export async function initSpellTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS spells (
      name TEXT PRIMARY KEY,
      source TEXT,
      level INTEGER,
      school TEXT,
      classes TEXT,
      casting_time TEXT,
      casting_time_abbr TEXT,
      range TEXT,
      components TEXT,
      duration TEXT,
      description TEXT,
      upgrade TEXT,
      component_verbal INTEGER,
      component_somatic INTEGER,
      component_material INTEGER,
      component_gold_required INTEGER,
      component_gold_consumed INTEGER,
      damage_type_array TEXT,
      saving_throw_array TEXT,
      aoe_shape_array TEXT,
      spell_attack INTEGER,
      ritual INTEGER
    );
  `);
}

export async function saveSpells(spells: Spell[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const spell of spells) {
      await db.runAsync(
        `INSERT OR REPLACE INTO spells (
          name, source, level, school, classes, casting_time, casting_time_abbr,
          range, components, duration, description, upgrade, component_verbal,
          component_somatic, component_material, component_gold_required, component_gold_consumed,
          damage_type_array, saving_throw_array, aoe_shape_array, spell_attack, ritual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          spell.name,
          spell.source,
          spell.level,
          spell.school,
          JSON.stringify(spell.classes),
          spell.castingTime,
          spell.castingTimeAbbr,
          spell.range,
          spell.components,
          spell.duration,
          spell.description,
          spell.upgrade ?? null,
          spell.componentVerbal ? 1 : 0,
          spell.componentSomatic ? 1 : 0,
          spell.componentMaterial ? 1 : 0,
          spell.componentGoldRequired ? 1 : 0,
          spell.componentGoldConsumed ? 1 : 0,
          JSON.stringify(spell.damageTypeArray),
          JSON.stringify(spell.savingThrowArray),
          JSON.stringify(spell.aoeShapeArray),
          spell.spellAttack ? 1 : 0,
          spell.ritual ? 1 : 0,
        ]
      );
    }
  });
}

export async function loadLightSpells(): Promise<LightSpell[]> {
  const db = await getDatabase();
  const lightSpells = await db.getAllAsync<Record<string, unknown>>(`
  SELECT 
    rowid, name, source, level, school, classes, casting_time_abbr, range, 
    duration, component_verbal, component_somatic, component_material, 
    component_gold_required, component_gold_consumed, damage_type_array, saving_throw_array, 
    aoe_shape_array, spell_attack, ritual
  FROM spells`
  );

  return lightSpells.map(row => ({
    rowid: row.rowid as number,
    name: row.name as string,
    source: row.source as string,
    level: row.level as number,
    school: row.school as string,
    classes: JSON.parse(row.classes as string),
    castingTimeAbbr: row.casting_time_abbr as string,
    range: row.range as string,
    duration: row.duration as string,
    componentVerbal: row.component_verbal === 1,
    componentSomatic: row.component_somatic === 1,
    componentMaterial: row.component_material === 1,
    componentGoldRequired: row.component_gold_required === 1,
    componentGoldConsumed: row.component_gold_consumed === 1,
    damageTypeArray: JSON.parse(row.damage_type_array as string),
    savingThrowArray: JSON.parse(row.saving_throw_array as string),
    aoeShapeArray: JSON.parse(row.aoe_shape_array as string),
    spellAttack: row.spell_attack === 1,
    ritual: row.ritual === 1,
  }));
}

export async function loadSpellHeavyDetails(rowid: number): Promise<SpellHeavyDetails | null> {
  const db = await getDatabase();
  // FIXED: Added "AS castingTime" alias so the object maps directly to the TypeScript interface shape
  const spellHeavyDetails = await db.getFirstAsync<SpellHeavyDetails>(
    `SELECT casting_time AS castingTime, description, upgrade, components 
     FROM spells 
     WHERE rowid = ?`,
    [rowid]
  );

  if (!spellHeavyDetails) {
    return null;
  }

  return spellHeavyDetails;
}

export async function loadFullSpell(rowid: number): Promise<Spell | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM spells WHERE rowid = ?`,
    [rowid]
  );

  if (!row) {
    return null;
  }

  return {
    rowid: row.rowid as number,
    name: row.name as string,
    source: row.source as string,
    level: row.level as number,
    school: row.school as string,
    classes: JSON.parse(row.classes as string),
    castingTimeAbbr: row.casting_time_abbr as string,
    range: row.range as string,
    duration: row.duration as string,
    componentVerbal: row.component_verbal === 1,
    componentSomatic: row.component_somatic === 1,
    componentMaterial: row.component_material === 1,
    componentGoldRequired: row.component_gold_required === 1,
    componentGoldConsumed: row.component_gold_consumed === 1,
    damageTypeArray: JSON.parse(row.damage_type_array as string),
    savingThrowArray: JSON.parse(row.saving_throw_array as string),
    aoeShapeArray: JSON.parse(row.aoe_shape_array as string),
    spellAttack: row.spell_attack === 1,
    ritual: row.ritual === 1,

    // FIXED: Changed row.castingTime to row.casting_time to correctly pull the snake_case database value
    castingTime: row.casting_time as string,
    description: row.description as string,
    upgrade: row.upgrade as string | null,
    components: row.components as string,
  };
}

export async function getSpellCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM spells'
  );
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
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    ['spell_data_version']
  );
  return row ? parseInt(row.value) : 0;
}

export async function setSpellDataVersion(version: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)',
    ['spell_data_version', version.toString()]
  );
}
