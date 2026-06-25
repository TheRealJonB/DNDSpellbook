import { getDatabase } from '../../../shared/storage/storageClient';
import { CampaignCharacter, Character } from '../models/fiveE/Character';

export async function initCharacterTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt: TEXT NOT NULL,
        campaignId INTEGER,
        FOREIGN KEY (campaignId) REFERENCES campaigns (id) ON DELETE SET NULL,
        level INTEGER,

        raceId INTEGER,
        FOREIGN KEY (raceId) REFERENCES races (id),

        backgroundId INTEGER,
        FOREIGN KEY (backgroundId) REFERENCES backgrounds (id),

        str INTEGER, dex INTEGER, con INTEGER, int INTEGER, wis INTEGER, cha INTEGER,
        strSave INTEGER, dexSave INTEGER, conSave INTEGER, intSave INTEGER, wisSave INTEGER, chaSave INTEGER,

        acrobatics INTEGER, animalHandling INTEGER, arcana INTEGER, atheltics INTEGER, deception INTEGER, 
        history INTEGER, insight INTEGER, intimidation INTEGER, investigation INTEGER, medicine INTEGER, 
        nature INTEGER, perception INTEGER, performance INTEGER, persuasion INTEGER, religion INTEGER, 
        slieghtOfHand INTEGER, stealth INTEGER, survival INTEGER, 
    );

    

    CREATE TABLE IF NOT EXISTS character_classes (
        character_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        PRIMARY KEY (character_id, class_id),
        FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS character_spells (
        character_id INTEGER NOT NULL,
        spell_id INTEGER NOT NULL,
        PRIMARY KEY (character_id, spell_id),
        FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
        FOREIGN KEY (spell_id) REFERENCES spells (id) ON DELETE CASCADE
    );
  `);
}

export async function saveCharacter(character: Character): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    let result = await db.runAsync(
      `INSERT OR REPLACE INTO campaigns (
        id, name, dungeon_master, created_at, edition
      ) VALUES (?, ?, ?, ?)`,
      [
        campaign.id || null,
        campaign.name,
        campaign.dungeonMaster,
        campaign.createdAt,
        campaign.edition,
      ]
    );

    // FIXED: Use campaign.id if it exists, otherwise fall back to database index row generation
    let campaignId = campaign.id && campaign.id > 0 ? campaign.id : result.lastInsertRowId;

    // Handle updates if row already exists under that specific campaign index
    if (result.changes === 0 && campaign.id) {
      await db.runAsync(
        `UPDATE campaigns SET name = ?, dungeon_master = ?, created_at = ?, edition = ? WHERE id = ?`,
        [campaign.name, campaign.dungeonMaster, campaign.createdAt, campaign.edition, campaignId]
      );
    }

    // 2. Clean out old sourcebook variants cleanly to prevent cascading key blockages
    await db.runAsync('DELETE FROM campaign_allowed_sources WHERE campaign_id = ?', [campaignId]);

    // 3. Populate array rows
    if (campaign.allowedSources) {
      for (const source of campaign.allowedSources) {
        await db.runAsync('INSERT INTO campaign_allowed_sources (campaign_id, source_name) VALUES (?, ?)', [campaignId, source]);
      }
    }
  });
}

export async function loadCharacter(id: number): Promise<Character | null> {
  const db = await getDatabase();
  const campaign = await db.getFirstAsync<Record<string, unknown>>(`
    SELECT 
      id, name, dungeon_master AS dungeonMaster, created_at AS createdAt, edition
    FROM campaigns 
    WHERE id = ?;
    `, [id]
  );

  if (!campaign) return null;
  const campaignId = campaign.id as number;

  const sourceLists = await db.getAllAsync<{ source_name: string }>(`
    SELECT source_name 
    FROM campaign_allowed_sources 
    WHERE campaign_id = ?;
    `, [campaignId]
  );
  const characterList = await db.getAllAsync<{ id: number }>(`
    SELECT id 
    FROM characters 
    WHERE campaign_id = ?;
    `, [campaignId]
  );

  return {
    id: campaignId,
    name: campaign.name as string,
    dungeonMaster: campaign.dungeonMaster as string,
    createdAt: campaign.createdAt as string,
    edition: campaign.edition as number,
    allowedSources: sourceLists.map(a => a.source_name),
    characterIds: characterList.map(a => a.id),

  }
}

export async function loadCharacters(): Promise<Character[]> {
  const db = await getDatabase();
  const campaigns = await db.getAllAsync<Record<string, unknown>>(`
    SELECT 
      id, name, dungeon_master AS dungeonMaster, created_at AS createdAt, edition
    FROM campaigns 
    `
  );

  const sourceLists = await db.getAllAsync<{ source_name: string }>(`
    SELECT campaign_id, source_name 
    FROM campaign_allowed_sources
    `,
  );
  const characterList = await db.getAllAsync<{ id: number }>(`
    SELECT id, campaign_id
    FROM characters 
    `,
  );

  return campaigns.map(campaign => {
    const campaignId = campaign.id as number;

    return {
      id: campaignId,
      name: campaign.name as string,
      dungeonMaster: campaign.dungeonMaster as string,
      createdAt: campaign.createdAt as string,
      edition: campaign.edition as number,
      allowedSources: sourceLists.filter(s => (s as any).campaign_id === campaignId).map(s => s.source_name),
      characterIds: characterList.filter(c => (c as any).campaign_id === campaignId).map(c => c.id),
    }
  })
}

export async function loadCampaignCharacters(campaignId: number): Promise<CampaignCharacter[]> {
  const db = await getDatabase();
  const campaignCharacters = await db.getAllAsync<CampaignCharacter>(`
    SELECT 
      characters.id, characters.name, characters.created_at AS createdAt, characters.campaign_id AS campaignId, characters.level, 
      races.name AS raceName, 
      classes.name, classes.level
    FROM characters 
    JOIN races ON race.character_id = characters.id
    JOIN classes ON classes.character_id = characters.id
    WHERE campaign_id=?
    `, [campaignId]
  );
export type LightClass = Pick<Class, 'name' | 'level'>
export type LightRace = Pick<Race, 'name'>
export type CampaignCharacter = Pick<Character, 'name' | 'createdAt' | 'campaignId' | 'level'> & {
  lightRace: LightRace;
  lightClasses: LightClass[];
}

  if (campaignCharacters.length === 0) {
    return [];
  }

  const characterIds = campaignCharacters.map(char => char.id);
  const placeholders = characterIds.map(() => '?').join(',');

  // export type LightClass = Pick<Class, 'id' | 'name' | 'level'>
  const lightClasses = await db.getAllAsync<any>(`
    SELECT character_id AS characterId, light_class_id AS id, name, level
    FROM character_light_classes
    WHERE character_id IN (${placeholders})
    `, characterIds
  );

  return campaignCharacters.map(character => {
    const characterId = character.id as number;

    return {
      id: character.id,
      name: character.name as string,
      createdAt: character.createdAt as string,
      campaignId: character.campaignId as number,
      lightRace: character.lightRace as string,
      level: character.level as number,
      lightClasses: lightClasses
        .filter(c => (c.characterId === characterId))
        .map(c => ({
          id: c.id,
          name: c.name,
          level: c.level
        }))
    };
  });
}


export async function deleteCharacter(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM campaigns WHERE id = ?', [id]);
}






export async function addSpellsToCharacters(characterIds: string[], spellNames: string[]): Promise<void> {
  if (characterIds.length === 0) return;

  const db = await getDatabase();

  // 1. Generate placeholders (?, ?, ?) for the dynamic array of IDs
  const placeholders = characterIds.map(() => '?').join(',');

  // 2. Fetch all target characters in a single query
  const rows = await db.getAllAsync<{ id: string; spell_names: string }>(
    `SELECT id, spell_names FROM characters WHERE id IN (${placeholders})`, characterIds
  );

  // 3. Use a transaction to perform all updates in a single disk write
  await db.withTransactionAsync(async () => {
    // 4. Prepare the update statement once to reuse it efficiently
    const statement = await db.prepareAsync(
      'UPDATE characters SET spell_names = ? WHERE id = ?'
    );

    try {
      for (const row of rows) {
        const existingSpells: string[] = JSON.parse(row.spell_names || '[]');
        const toAdd = spellNames.filter(name => !existingSpells.includes(name));

        if (toAdd.length === 0) continue;

        const updated = [...existingSpells, ...toAdd];

        // Execute the prepared statement with the updated array
        await statement.executeAsync([JSON.stringify(updated), row.id]);
      }
    } finally {
      // Always finalize your prepared statements to prevent memory leaks
      await statement.finalizeAsync();
    }
  });
}

export async function removeSpellsFromCharacter(characterId: string, spellNames: string[]): Promise<void> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ spell_names: string }>(
    'SELECT spell_names FROM characters WHERE id = ?',
    [characterId]
  );
  if (!row) return;


  const newSpells: string[] = (JSON.parse(row.spell_names) as string[]).filter(n => !spellNames.includes(n));
  await db.runAsync(
    'UPDATE characters SET spell_names = ? WHERE id = ?',
    [JSON.stringify(newSpells), characterId]
  );
}
