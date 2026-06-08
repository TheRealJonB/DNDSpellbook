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
      casting_time_abbr TEXT,
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
      is_spell_attack INTEGER,
      is_ritual INTEGER
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
          range, components, duration, description, upgrade, has_verbal,
          has_somatic, has_material, material_cost_contains_gp, material_is_consumed,
          damage_type_array, saving_throw_array, aoe_shape_array, is_spell_attack, is_ritual
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

export async function loadSpells(): Promise<Spell[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM spells ORDER BY level ASC, name ASC'
  );
  return rows.map(row => ({
    name: row.name as string,
    source: row.source as string,
    level: row.level as number,
    school: row.school as string,
    classes: JSON.parse(row.classes as string),
    castingTime: row.casting_time as string,
    castingTimeAbbr: row.casting_time_abbr as string,
    range: row.range as string,
    components: row.components as string,
    duration: row.duration as string,
    description: row.description as string,
    upgrade: row.upgrade as string | null,
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

export async function getSpellCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM spells'
  );
  return result?.count ?? 0;
}