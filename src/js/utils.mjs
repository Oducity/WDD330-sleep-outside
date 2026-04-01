// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Get URL parameter value
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function formDataToJSON(formData) {
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

// Render a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Fetch an HTML template file and return it as text
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Load and render header and footer templates
export async function loadHeaderFooter() {
  // Load header
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#main-header");
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }

  // Load footer
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// 🚨 CUSTOM ALERT MESSAGE (NEW)
export function alertMessage(message, scroll = true) {
  // create container
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // message content
  alert.innerHTML = `
    <p>${message}</p>
    <span class="close-btn" style="cursor:pointer;">❌</span>
  `;

  // The event will close only if you click the X
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-btn")) {
      alert.remove();
    }
  });

  // insert above the main section
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  // Scroll up if necessary
  if (scroll) {
    window.scrollTo(0, 0);
  }
}