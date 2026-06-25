import { getDatabase } from '../../../shared/storage/storageClient';
import { Campaign } from '../models/Campaign';
import { loadCampaignCharacters } from './characterStorage';

export async function initCampaignTable(): Promise<void> {
  const db = await getDatabase();

  // Enable foreign key support inside SQLite explicitly
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      dungeon_master TEXT,
      created_at TEXT NOT NULL,
      edition TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_allowed_sources (
        campaign_id INTEGER NOT NULL,
        source_name TEXT NOT NULL,
        PRIMARY KEY (campaign_id, source_name),
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE
    );
  `);
}

export async function saveCampaign(campaign: Campaign): Promise<void> {
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

export async function loadCampaign(id: number): Promise<Campaign | null> {
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

  const characterList = await loadCampaignCharacters(id);

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

export async function loadCampaigns(): Promise<Campaign[]> {
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

  const characterList = await loadCampaignsCharacters();

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

export async function updateCampaign(campaign: Campaign): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync(`
      UPDATE campaigns
      SET name=?, dungeon_master=?, edition=?
      WHERE id = ?;
    `, [campaign.name, campaign.dungeonMaster, campaign.edition, campaign.id]
    );

    // 2. Clear out all old sourcebook entries for this campaign to start fresh
    await db.runAsync(
      'DELETE FROM campaign_allowed_sources WHERE campaign_id = ?',
      [campaign.id]
    );

    // 3. Re-insert the updated array of allowed sourcebooks
    if (campaign.allowedSources && campaign.allowedSources.length > 0) {
      for (const source of campaign.allowedSources) {
        await db.runAsync(
          'INSERT INTO campaign_allowed_sources (campaign_id, source_name) VALUES (?, ?)',
          [campaign.id, source]
        );
      }
    }
  });
}

export async function deleteCampaign(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM campaigns WHERE id = ?', [id]);
}