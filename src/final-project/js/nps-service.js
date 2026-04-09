const NPS_BASE = "https://developer.nps.gov/api/v1";
const NPS_KEY = import.meta.env.VITE_NPS_API_KEY;

function requireApiKey() {
  if (!NPS_KEY) {
    throw new Error("Missing VITE_NPS_API_KEY in your .env file.");
  }
}

async function toJsonOrThrow(response) {
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "NPS request failed");
  }
  return json;
}

export async function searchParks({ stateCode = "", q = "", limit = 10 } = {}) {
  requireApiKey();

  const params = new URLSearchParams({
    api_key: NPS_KEY,
    limit: String(limit),
  });
  if (stateCode) params.set("stateCode", stateCode);
  if (q) params.set("q", q);

  const res = await fetch(NPS_BASE + "/parks?" + params.toString());
  const json = await toJsonOrThrow(res);
  return json.data || [];
}

export async function getAlerts({ parkCode = "", limit = 10 } = {}) {
  requireApiKey();

  const params = new URLSearchParams({
    api_key: NPS_KEY,
    limit: String(limit),
  });
  if (parkCode) params.set("parkCode", parkCode);

  const res = await fetch(NPS_BASE + "/alerts?" + params.toString());
  const json = await toJsonOrThrow(res);
  return json.data || [];
}
