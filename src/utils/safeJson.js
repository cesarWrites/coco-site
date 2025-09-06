export async function safeFetchJson(url, fallback = []) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`[safeFetchJson] Failed: ${url}, status=${res.status}`);
      return fallback;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(`[safeFetchJson] Non-JSON response from ${url}`);
      return fallback;
    }

    return await res.json();
  } catch (err) {
    console.error(`[safeFetchJson] Error fetching ${url}:`, err);
    return fallback;
  }
}
