export class RulesEngine {
  /**
   * Calculates proficiency bonus from a character level.
   * Works for BOTH CampaignCharacter and full Character objects.
   */
  public static getProficiencyBonus(level: number): number {
    return Math.floor((level - 1) / 4) + 2;
  }

  /**
   * Calculates ability modifiers (e.g., score of 14 returns 2)
   */
  public static getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  public static calculateMaxUses(rule: string, level: number, intelligence: number): number {
    if (!isNaN(Number(rule))) return Number(rule);

    switch (rule) {
      case 'PROF':
        return this.getProficiencyBonus(level);
      case 'MOD_INT':
        return Math.max(1, this.getModifier(intelligence));
      // Easy to expand with MOD_WIS, MOD_CHA, etc.
      default:
        return 1;
    }
  }
}
