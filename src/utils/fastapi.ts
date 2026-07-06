export async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 4000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI Request Failed: ${response.statusText}`);
    }
    
    return await response.json();
  } finally {
    clearTimeout(id);
  }
}

const getBaseUrl = () => import.meta.env.FASTAPI_BASE_URL || '';

export async function optimizeRouting(payload: any) {
  return fetchWithTimeout(`${getBaseUrl()}/api/v1/optimize-routing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function scrapeIntelligence(payload: any) {
  return fetchWithTimeout(`${getBaseUrl()}/api/v1/scrape-intelligence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function paraphrase(payload: any) {
  return fetchWithTimeout(`${getBaseUrl()}/api/v1/paraphrase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
