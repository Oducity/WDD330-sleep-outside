const baseURL = import.meta.env.VITE_SERVER_URL;
const CACHE_PREFIX = "so-cache:";
const memoryCache = new Map();

function getCachedValue(key) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function setCachedValue(key, value) {
  memoryCache.set(key, value);
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota and private mode errors.
  }
}

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    const cacheKey = `category:${category}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetch(`${baseURL}products/search/${encodeURIComponent(category)}`);
    const data = await convertToJson(response);
    const result = data.Result;
    setCachedValue(cacheKey, result);
    return result;
  }

  async findProductById(id) {
    const cacheKey = `product:${id}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(response);
    const result = data.Result;
    setCachedValue(cacheKey, result);
    return result;
  }

  async checkout(payload) {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return convertToJson(response);
  }
}
