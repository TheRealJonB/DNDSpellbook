const BASE_URL = 'https://dnd-mobile.onrender.com';
const TIMEOUT_MS = 120000;

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
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