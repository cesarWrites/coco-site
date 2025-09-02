// lib/safeFetchJson.js
export async function safeFetchJson(url, defaultValue = null, opts = {}) {
  const retries = opts.retries ?? 2;
  const timeoutMs = opts.timeout ?? 8000;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      return json;
    } catch (err) {
      clearTimeout(id);
      console.error(`[safeFetchJson] attempt ${attempt} failed for ${url}:`, err.message);

      if (attempt === retries) {
        console.warn(`[safeFetchJson] returning default value for ${url}`);
        return defaultValue;
      }
      // exponential-ish backoff
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return defaultValue;
}
