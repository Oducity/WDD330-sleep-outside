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
  const location = data.location || {};
  const city = location.city || data.city || {};
  const region = location.region || data.region || {};
  const country = location.country || data.country || {};

  return {
    city: city.name || city.name_translated || city || "Unknown",
    region: region.name || region.name_translated || data.region_name || region || "Unknown",
    country: country.name || country.name_translated || data.country_name || country || "Unknown",
    latitude: location.latitude || data.latitude || null,
    longitude: location.longitude || data.longitude || null,
  };
}
