import { alertMessage, loadHeaderFooter } from "../../js/utils.mjs";
import { getUserGeo } from "./geo-service.js";
import { focusPark, initMap, parseParkLatLong, renderParkMarkers, setUserMarker } from "./map-helper.js";
import { getAlerts, searchParks } from "./nps-service.js";
// import { getFavorites, isFavorite, toggleFavorite } from "./storage.js";

const form = document.querySelector("#park-search-form");
const resultsSummary = document.querySelector("#results-summary");
const parkResults = document.querySelector("#park-results");
const alertsList = document.querySelector("#alerts-list");
const alertsStatus = document.querySelector("#alerts-status");
const geoStatus = document.querySelector("#geo-status");
const geoCard = document.querySelector("#geo-card");
const mapStatus = document.querySelector("#map-status");
const detailStatus = document.querySelector("#detail-status");
const detailCard = document.querySelector("#park-detail-card");
const parkResultsViewport = document.querySelector(".park-results-viewport");
let parkCarouselControls;
let parkCarouselIndexText;

let currentParks = [];
let alertCarouselIntervalId;
let parkCarouselIntervalId;
let parkCarouselIndex = 0;

function createParkPopup() {
  const backdrop = document.createElement("div");
  backdrop.className = "park-popup-backdrop";
  backdrop.innerHTML = `
    <section class="park-popup" role="dialog" aria-modal="true" aria-label="Park details popup">
      <button type="button" class="park-popup__close" aria-label="Close park details">x</button>
      <h3 class="park-popup__title"></h3>
      <p class="park-popup__description"></p>
      <ul class="park-popup__meta"></ul>
      <a class="park-popup__link" target="_blank" rel="noopener noreferrer"></a>
    </section>
  `;

  const closeButton = backdrop.querySelector(".park-popup__close");
  closeButton.addEventListener("click", () => backdrop.classList.remove("is-open"));
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      backdrop.classList.remove("is-open");
    }
  });

  return backdrop;
}

const parkPopup = createParkPopup();

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

function createDetailLink(url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open park website";
  link.className = "park-link";
  return link;
}
// Carousel logic for park page
function ensureParkCarouselControls() {
  if (!parkResultsViewport || parkCarouselControls) {
    return;
  }

  parkCarouselControls = document.createElement("div");
  parkCarouselControls.className = "park-carousel__controls";

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "park-carousel__button";
  previousButton.textContent = "Previous";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "park-carousel__button";
  nextButton.textContent = "Next";

  parkCarouselIndexText = document.createElement("p");
  parkCarouselIndexText.className = "park-carousel__index";

  previousButton.addEventListener("click", () => {
    previousParkSlide();
    restartParkCarousel();
  });

  nextButton.addEventListener("click", () => {
    nextParkSlide();
    restartParkCarousel();
  });

  parkCarouselControls.append(previousButton, parkCarouselIndexText, nextButton);
  parkResultsViewport.insertAdjacentElement("afterend", parkCarouselControls);
}
function getParkItemHeight() {
  const firstItem = parkResults.querySelector(".park-result-item");
  if (!firstItem) {
    return 0;
  }
  return firstItem.getBoundingClientRect().height;
}
function updateParkCarouselPosition() {
  if (!currentParks.length) {
    parkResults.style.transform = "translateY(0px)";
    if (parkCarouselIndexText) {
      parkCarouselIndexText.textContent = "0 / 0";
    }
    return;
  }
  const itemHeight = getParkItemHeight();
  if (!itemHeight) {
    return;
  }
  parkResults.style.transform = `translateY(-${parkCarouselIndex * itemHeight}px)`;
  if (parkCarouselIndexText) {
    parkCarouselIndexText.textContent = `${parkCarouselIndex + 1} / ${currentParks.length}`;
  }
}
function nextParkSlide() {
  if (currentParks.length < 2) {
    return;
  }
  parkCarouselIndex = (parkCarouselIndex + 1) % currentParks.length;
  updateParkCarouselPosition();
}
function previousParkSlide() {
  if (currentParks.length < 2) {
    return;
  }
  parkCarouselIndex = (parkCarouselIndex - 1 + currentParks.length) % currentParks.length;
  updateParkCarouselPosition();
}
function stopParkCarousel(reset = true) {
  if (parkCarouselIntervalId) {
    clearInterval(parkCarouselIntervalId);
    parkCarouselIntervalId = undefined;
  }
  if (reset) {
    parkCarouselIndex = 0;
    updateParkCarouselPosition();
  }
}
function restartParkCarousel() {
  if (parkCarouselIntervalId) {
    clearInterval(parkCarouselIntervalId);
    parkCarouselIntervalId = undefined;
  }
  if (currentParks.length > 1) {
    parkCarouselIntervalId = window.setInterval(nextParkSlide, 10000);
  }
}
function startParkCarousel(parks) {
  stopParkCarousel();
  if (!parks.length || !parkResultsViewport) {
    updateParkCarouselPosition();
    return;
  }
  updateParkCarouselPosition();
  restartParkCarousel();
}

function openParkPopup(park) {
  const title = parkPopup.querySelector(".park-popup__title");
  const description = parkPopup.querySelector(".park-popup__description");
  const meta = parkPopup.querySelector(".park-popup__meta");
  const link = parkPopup.querySelector(".park-popup__link");
  title.textContent = park.fullName;
  description.textContent = park.description || "No detailed description is available yet.";
  meta.innerHTML = "";
  meta.append(
    createMetaItem("Park Code", park.parkCode),
    createMetaItem("State(s)", park.states),
    createMetaItem("Directions", park.directionsInfo || "Not provided"),
    createMetaItem("Activities", park.activities?.slice(0, 5).map((item) => item.name).join(", ") || "Not listed")
  );
  if (park.url) {
    link.href = park.url;
    link.textContent = "Open park website";
    link.style.display = "inline-block";
  } else {
    link.style.display = "none";
  }
  parkPopup.classList.add("is-open");
}

function renderParkDetail(park) {
  if (!detailCard || !detailStatus) {
    return;
  }
  detailCard.innerHTML = "";
  detailStatus.textContent = `Showing details for ${park.fullName}.`;
  detailCard.appendChild(createTextElement("h3", park.fullName));
  detailCard.appendChild(
    createTextElement(
      "p",
      park.description || "No detailed description is available yet.",
      "park-card__description"
    )
  );

  const detailsList = document.createElement("ul");
  detailsList.className = "park-meta";
  detailsList.append(
    createMetaItem("Park Code", park.parkCode),
    createMetaItem("State(s)", park.states),
    createMetaItem("Directions", park.directionsInfo || "Not provided"),
    createMetaItem("Activities", park.activities?.slice(0, 5).map((item) => item.name).join(", ") || "Not listed")
  );
  detailCard.appendChild(detailsList);

  if (park.url) {
    detailCard.appendChild(createDetailLink(park.url));
  }
}

function renderResults(parks) {
  ensureParkCarouselControls();
  stopParkCarousel();
  parkResults.innerHTML = "";
  parkResults.classList.add("park-results--carousel");
  currentParks = parks;

  renderParkMarkers(
    parks,
    (park) => {
      renderParkDetail(park);
    },
    mapStatus
  );

  if (!parks.length) {
    parkResults.classList.remove("park-results--carousel");
    const empty = createTextElement(
      "li",
      "No parks matched that search. Try another state code or park name.",
      "empty-state"
    );
    parkResults.appendChild(empty);
    updateParkCarouselPosition();
    return;
  }

  parks.forEach((park) => {
    const item = document.createElement("li");
    item.className = "park-result-item";

    const nameButton = document.createElement("button");
    nameButton.type = "button";
    nameButton.className = "park-name-button";
    nameButton.dataset.parkCode = park.parkCode;
    nameButton.textContent = park.fullName;
    item.appendChild(nameButton);

    parkResults.appendChild(item);
  });

  startParkCarousel(parks);
}

function renderAlerts(alerts) {
  if (alertCarouselIntervalId) {
    clearInterval(alertCarouselIntervalId);
    alertCarouselIntervalId = undefined;
  }

  alertsList.innerHTML = "";
  if (!alerts.length) {
    alertsStatus.textContent = "No active alerts were returned for this starter view.";
    alertsList.appendChild(
      createTextElement("p", "No alerts are available right now.", "empty-state")
    );
    return;
  }
  alertsStatus.textContent = `Showing ${alerts.length} current alert${alerts.length === 1 ? "" : "s"}.`;

  let currentIndex = 0;

  const carousel = document.createElement("div");
  carousel.className = "alert-carousel";

  const article = document.createElement("article");
  article.className = "alert-card";

  const controls = document.createElement("div");
  controls.className = "alert-carousel__controls";

  const progressTrack = document.createElement("div");
  progressTrack.className = "alert-carousel__progress-track";

  const progressBar = document.createElement("div");
  progressBar.className = "alert-carousel__progress-bar";
  progressTrack.appendChild(progressBar);

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.className = "alert-carousel__button";
  prevButton.textContent = "Previous";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "alert-carousel__button";
  nextButton.textContent = "Next";

  const indexText = document.createElement("p");
  indexText.className = "alert-carousel__index";

  function paintSlide(animate = false) {
    const alert = alerts[currentIndex];

    const updateContent = () => {
      article.innerHTML = "";
      article.classList.remove("is-expanded");

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

      const expandButton = document.createElement("button");
      expandButton.type = "button";
      expandButton.className = "alert-card__toggle";
      expandButton.textContent = "Expand";
      expandButton.addEventListener("click", () => {
        const expanded = article.classList.toggle("is-expanded");
        expandButton.textContent = expanded ? "Collapse" : "Expand";
      });
      article.appendChild(expandButton);

      indexText.textContent = `Alert ${currentIndex + 1} of ${alerts.length}`;
      progressBar.style.width = `${((currentIndex + 1) / alerts.length) * 100}%`;
    };

    if (!animate) {
      updateContent();
      return;
    }

    article.classList.add("is-transitioning");
    window.setTimeout(() => {
      updateContent();
      article.classList.remove("is-transitioning");
    }, 160);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % alerts.length;
    paintSlide(true);
  }

  function previousSlide() {
    currentIndex = (currentIndex - 1 + alerts.length) % alerts.length;
    paintSlide(true);
  }

  prevButton.addEventListener("click", previousSlide);
  nextButton.addEventListener("click", nextSlide);

  controls.append(prevButton, indexText, nextButton);
  carousel.append(article, progressTrack, controls);
  alertsList.appendChild(carousel);

  paintSlide();

  if (alerts.length > 1) {
    alertCarouselIntervalId = window.setInterval(nextSlide, 10000);
    carousel.addEventListener("mouseenter", () => {
      if (alertCarouselIntervalId) {
        clearInterval(alertCarouselIntervalId);
        alertCarouselIntervalId = undefined;
      }
    });
    carousel.addEventListener("mouseleave", () => {
      alertCarouselIntervalId = window.setInterval(nextSlide, 10000);
    });
  }
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

  if (geo.latitude != null && geo.longitude != null) {
    setUserMarker(geo.latitude, geo.longitude, mapStatus);
  }
}

async function loadStarterData() {
  resultsSummary.textContent = "Loading Utah starter parks...";
  const [parks, alerts] = await Promise.all([
    searchParks({ stateCode: "UT", limit: 6 }),
    getAlerts({ limit: 4 }),
  ]);
  renderResults(parks);
  renderAlerts(alerts);
  resultsSummary.textContent = `Showing ${parks.length} starter park${parks.length === 1 ? "" : "s"}.`;

  if (parks[0]) {
    renderParkDetail(parks[0]);
  }
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
    resultsSummary.textContent = `Found ${parks.length} park${parks.length === 1 ? "" : "s"} for ${searchLabel}.`;

    if (parks[0]) {
      renderParkDetail(parks[0]);
    }
  } catch (error) {
    resultsSummary.textContent = "Search failed.";
    alertMessage(error.message, false);
  }
}

function handleParkInteractions(event) {
  const button = event.target.closest(".park-name-button");
  if (!button) {
    return;
  }

  const { parkCode } = button.dataset;
  const selectedPark = currentParks.find((park) => park.parkCode === parkCode);
  if (!selectedPark) {
    return;
  }

  renderParkDetail(selectedPark);
  openParkPopup(selectedPark);
  focusPark(selectedPark);

  const coords = parseParkLatLong(selectedPark.latLong);
  if (!coords && mapStatus) {
    mapStatus.textContent = "This park has no coordinates for map focus.";
  }
}

async function init() {
  document.body.appendChild(parkPopup);

  await loadHeaderFooter();
  initMap("map-canvas", mapStatus);

  if (parkResultsViewport) {
    parkResultsViewport.addEventListener("mouseenter", () => stopParkCarousel(false));
    parkResultsViewport.addEventListener("mouseleave", restartParkCarousel);
  }

  form.addEventListener("submit", handleSearch);
  parkResults.addEventListener("click", handleParkInteractions);

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
