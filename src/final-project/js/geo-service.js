const GEO_URL = "https://api.ipbase.com/v2/info";
const GEO_KEY = import.meta.env.VITE_GEO_API_KEY;

export async function getUserGeo() {
  if (!GEO_KEY) {
    throw new Error("Missing VITE_GEO_API_KEY in your .env file.");
  }

  const url = GEO_URL + "?apikey=" + encodeURIComponent(GEO_KEY);
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Geolocation request failed");
  }

  const data = json.data || json;
  return {
    city: data.city?.name || data.city || "Unknown",
    region: data.region?.name || data.region_name || data.region || "Unknown",
    country: data.country?.name || data.country_name || data.country || "Unknown",
    latitude: data.location?.latitude || data.latitude || null,
    longitude: data.location?.longitude || data.longitude || null,
  };
}
