import { getDatabase } from '../../../shared/storage/storageClient';
import { Spell } from '../models/Spell';

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
      range TEXT,
      components TEXT,
      duration TEXT,
      description TEXT,
      upgrade TEXT,
      has_verbal INTEGER,
      has_somatic INTEGER,
      has_material INTEGER,
      material_cost_contains_gp INTEGER,
      material_is_consumed INTEGER,
      damage_type_array TEXT,
      saving_throw_array TEXT,
      aoe_shape_array TEXT,
      is_spell_attack INTEGER
    );
  `);
}

export async function saveSpells(spells: Spell[]): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (const spell of spells) {
      await db.runAsync(
        `INSERT OR REPLACE INTO spells (
          name, source, level, school, classes, casting_time, range,
          components, duration, description, upgrade, has_verbal,
          has_somatic, has_material, material_cost_contains_gp,
          material_is_consumed, damage_type_array, saving_throw_array,
          aoe_shape_array, is_spell_attack
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          spell.name,
          spell.source,
          spell.level,
          spell.school,
          JSON.stringify(spell.classes),
          spell.castingTime,
          spell.range,
          spell.components,
          spell.duration,
          spell.description,
          spell.upgrade ?? null,
          spell.hasVerbal ? 1 : 0,
          spell.hasSomatic ? 1 : 0,
          spell.hasMaterial ? 1 : 0,
          spell.materialCostContainsGP ? 1 : 0,
          spell.materialIsConsumed ? 1 : 0,
          JSON.stringify(spell.damageTypeArray),
          JSON.stringify(spell.savingThrowArray),
          JSON.stringify(spell.aoeShapeArray),
          spell.isSpellAttack ? 1 : 0,
        ]
      );
    }
  });
}

export async function loadSpells(): Promise<Spell[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>('SELECT * FROM spells ORDER BY level ASC, name ASC');

  return rows.map(row => ({
    name: row.name as string,
    source: row.source as string,
    level: row.level as number,
    school: row.school as string,
    classes: JSON.parse(row.classes as string),
    castingTime: row.casting_time as string,
    range: row.range as string,
    components: row.components as string,
    duration: row.duration as string,
    description: row.description as string,
    upgrade: row.upgrade as string | null,
    hasVerbal: row.has_verbal === 1,
    hasSomatic: row.has_somatic === 1,
    hasMaterial: row.has_material === 1,
    materialCostContainsGP: row.material_cost_contains_gp === 1,
    materialIsConsumed: row.material_is_consumed === 1,
    damageTypeArray: JSON.parse(row.damage_type_array as string),
    savingThrowArray: JSON.parse(row.saving_throw_array as string),
    aoeShapeArray: JSON.parse(row.aoe_shape_array as string),
    isSpellAttack: row.is_spell_attack === 1,
  }));
}

export async function getSpellCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM spells');
  return result?.count ?? 0;
}

export async function clearSpells(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM spells');
}