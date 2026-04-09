// const headerUrl = "../final-public/json/header.json";

// import displaybodychildren from "./header-footer.mjs";

// const displaybody = new displaybodychildren;
// displaybody(headerUrl);

import { alertMessage, loadHeaderFooter } from "../../js/utils.mjs";
import { getUserGeo } from "./geo-service.js";
import { getAlerts, searchParks } from "./nps-service.js";
import { getFavorites, isFavorite, toggleFavorite } from "./storage.js";

const form = document.querySelector("#park-search-form");
const resultsSummary = document.querySelector("#results-summary");
const parkResults = document.querySelector("#park-results");
const alertsList = document.querySelector("#alerts-list");
const alertsStatus = document.querySelector("#alerts-status");
const geoStatus = document.querySelector("#geo-status");
const geoCard = document.querySelector("#geo-card");

function createTextElement(tagName, text, className = "") {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

function createMetaItem(label, value) {
  const item = document.createElement("li");
  item.className = "park-meta__item";
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  item.appendChild(strong);
  item.append(value ?? "Not available");
  return item;
}

function renderResults(parks) {
  parkResults.innerHTML = "";
  if (!parks.length) {
    const empty = createTextElement(
      "li",
      "No parks matched that search. Try another state code or park name.",
      "empty-state"
    );
    parkResults.appendChild(empty);
    return;
  }

  parks.forEach((park) => {
    const item = document.createElement("li");
    item.className = "park-card";
    const topRow = document.createElement("div");
    topRow.className = "park-card__top";
    const headingWrap = document.createElement("div");
    headingWrap.appendChild(createTextElement("h3", park.fullName));
    headingWrap.appendChild(
      createTextElement(
        "p",
        park.states ? `States: ${park.states}` : "State information unavailable",
        "park-card__subtitle"
      )
    );
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "favorite-button";
    favoriteButton.dataset.parkCode = park.parkCode;
    favoriteButton.textContent = isFavorite(park.parkCode)
      ? "Remove Favorite"
      : "Save Favorite";
    topRow.append(headingWrap, favoriteButton);
    const description = createTextElement(
      "p",
      park.description || "No description is available yet.",
      "park-card__description"
    );
    const meta = document.createElement("ul");
    meta.className = "park-meta";
    meta.append(
      createMetaItem("Park Code", park.parkCode),
      createMetaItem("Activities", park.activities?.slice(0, 3).map((activity) => activity.name).join(", ")),
      createMetaItem("Website", park.url || "Not available")
    );
    item.append(topRow, description, meta);
    parkResults.appendChild(item);
  });
}

function renderAlerts(alerts) {
  alertsList.innerHTML = "";
  if (!alerts.length) {
    alertsStatus.textContent = "No active alerts were returned for this starter view.";
    alertsList.appendChild(
      createTextElement("p", "No alerts are available right now.", "empty-state")
    );
    return;
  }
  alertsStatus.textContent = `Showing ${alerts.length} current alert${alerts.length === 1 ? "" : "s"}.`;
  alerts.forEach((alert) => {
    const article = document.createElement("article");
    article.className = "alert-card";
    article.appendChild(createTextElement("h3", alert.title || "Park Alert"));
    article.appendChild(
      createTextElement(
        "p",
        alert.description || alert.category || "No additional details were provided.",
        "alert-card__text"
      )
    );
    article.appendChild(
      createTextElement(
        "p",
        alert.relatedRoadEvents || alert.category || "General notice",
        "alert-card__meta"
      )
    );
    alertsList.appendChild(article);
  });
}

function renderGeo(geo) {
  geoCard.innerHTML = "";
  geoStatus.textContent = "Approximate location loaded from your IP address.";
  const list = document.createElement("ul");
  list.className = "geo-list";
  list.append(
    createMetaItem("City", geo.city),
    createMetaItem("Region", geo.region),
    createMetaItem("Country", geo.country),
    createMetaItem(
      "Coordinates",
      geo.latitude != null && geo.longitude != null
        ? `${geo.latitude}, ${geo.longitude}`
        : "Not available"
    )
  );
  geoCard.appendChild(list);
}

async function loadStarterData() {
  resultsSummary.textContent = "Loading Utah starter parks...";
  const [parks, alerts] = await Promise.all([
    searchParks({ stateCode: "UT", limit: 6 }),
    getAlerts({ limit: 4 }),
  ]);
  renderResults(parks);
  renderAlerts(alerts);
  resultsSummary.textContent = `Showing ${parks.length} starter park${parks.length === 1 ? "" : "s"}. Favorites saved: ${getFavorites().length}.`;
}

async function handleSearch(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const stateCode = (formData.get("stateCode") || "").toString().trim().toUpperCase();
  const query = (formData.get("q") || "").toString().trim();

  resultsSummary.textContent = "Searching parks...";

  try {
    const parks = await searchParks({ stateCode, q: query, limit: 9 });
    renderResults(parks);

    const searchLabel = stateCode || query || "all parks";
    resultsSummary.textContent = `Found ${parks.length} park${parks.length === 1 ? "" : "s"} for ${searchLabel}. Favorites saved: ${getFavorites().length}.`;
  } catch (error) {
    resultsSummary.textContent = "Search failed.";
    alertMessage(error.message, false);
  }
}

function handleFavorites(event) {
  const button = event.target.closest(".favorite-button");
  if (!button) {
    return;
  }

  const { parkCode } = button.dataset;
  const nextFavorites = toggleFavorite(parkCode);
  button.textContent = isFavorite(parkCode) ? "Remove Favorite" : "Save Favorite";
  resultsSummary.textContent = `Favorites saved: ${nextFavorites.length}.`;
}

async function init() {
  await loadHeaderFooter();
  form.addEventListener("submit", handleSearch);
  parkResults.addEventListener("click", handleFavorites);

  try {
    await loadStarterData();
  } catch (error) {
    resultsSummary.textContent = "Starter park load failed.";
    alertsStatus.textContent = "Alert feed unavailable.";
    alertMessage(error.message, false);
  }

  try {
    const geo = await getUserGeo();
    renderGeo(geo);
  } catch (error) {
    geoStatus.textContent = "Location lookup unavailable.";
    geoCard.appendChild(
      createTextElement("p", error.message, "empty-state")
    );
  }
}

init();
