let map;
let parkLayer;
let userMarker;
const markerIndex = new Map();

export function parseParkLatLong(latLongText = "") {
  const match = /lat:\s*([-\d.]+),\s*long:\s*([-\d.]+)/i.exec(latLongText);
  if (!match) {
    return null;
  }

  const lat = Number.parseFloat(match[1]);
  const lng = Number.parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return [lat, lng];
}

export function initMap(containerId, statusElement) {
  if (!window.L) {
    throw new Error("Leaflet did not load. Check your network connection.");
  }

  map = window.L.map(containerId, { zoomControl: true }).setView([39.5, -98.35], 4);
  window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    subdomains: "abcd",
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
  }).addTo(map);

  parkLayer = window.L.layerGroup().addTo(map);
  if (statusElement) {
    statusElement.textContent = "Map loaded. Search parks to drop markers.";
  }

  return map;
}

export function renderParkMarkers(parks, onSelect, statusElement) {
  if (!map || !parkLayer) {
    return;
  }

  parkLayer.clearLayers();
  markerIndex.clear();

  const boundsPoints = [];
  parks.forEach((park) => {
    const coords = parseParkLatLong(park.latLong);
    if (!coords) {
      return;
    }

    const marker = window.L.marker(coords);
    marker.bindPopup(`<strong>${park.fullName}</strong><br>${park.states || "Unknown state"}`);
    marker.on("click", () => {
      if (onSelect) {
        onSelect(park);
      }
    });
    marker.addTo(parkLayer);
    markerIndex.set(park.parkCode, marker);
    boundsPoints.push(coords);
  });

  if (boundsPoints.length) {
    map.fitBounds(boundsPoints, { padding: [30, 30] });
    if (statusElement) {
      statusElement.textContent = `Showing ${boundsPoints.length} mapped park${boundsPoints.length === 1 ? "" : "s"}.`;
    }
  } else if (statusElement) {
    statusElement.textContent = "No coordinates available for this result set.";
  }
}

export function focusPark(park) {
  if (!map || !park?.parkCode) {
    return;
  }

  const marker = markerIndex.get(park.parkCode);
  if (marker) {
    map.flyTo(marker.getLatLng(), 8, { duration: 0.75 });
    marker.openPopup();
  }
}

export function setUserMarker(lat, lng, statusElement) {
  if (!map || lat == null || lng == null) {
    return;
  }

  if (userMarker) {
    userMarker.remove();
  }

  userMarker = window.L.circleMarker([lat, lng], {
    radius: 8,
    color: "#f4d35e",
    weight: 3,
    fillColor: "#1f4f2a",
    fillOpacity: 0.85,
  }).addTo(map);

  userMarker.bindPopup("Your approximate location");

  if (statusElement) {
    statusElement.textContent = "Map loaded with your approximate location.";
  }
}
