import { apiFetch } from '../../../shared/api/apiClient';
import { Spell } from '../models/Spell';

export async function fetchAllSpells(): Promise<Spell[]> {
  return apiFetch<Spell[]>('/spells');
}

export async function fetchSpellByName(name: string): Promise<Spell> {
  return apiFetch<Spell>(`/spells/${encodeURIComponent(name)}`);
}