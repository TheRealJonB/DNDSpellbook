import { API_CONFIG } from '../config/apiConfig';

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out — the server may be waking up, try again');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}