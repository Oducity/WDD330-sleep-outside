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

export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) return;

  const existing = main.querySelector(".alert-message");
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.classList.add("alert-message");

  const text = typeof message === "object" ? JSON.stringify(message) : message;
  alert.innerHTML = `<p>${text}</p><button class="alert-close" aria-label="Close">&#10005;</button>`;
  alert.querySelector(".alert-close").addEventListener("click", () => alert.remove());

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Load and render header and footer templates
export async function loadHeaderFooter() {
  // Load header
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#main-header");
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);

    const projectsMenu = headerElement.querySelector(".projects-menu");
    if (projectsMenu) {
      const summary = projectsMenu.querySelector("summary");
      let isPinnedOpen = false;

      const openMenu = () => projectsMenu.setAttribute("open", "");
      const closeMenu = () => projectsMenu.removeAttribute("open");

      projectsMenu.addEventListener("mouseenter", () => {
        if (!isPinnedOpen) {
          openMenu();
        }
      });

      projectsMenu.addEventListener("mouseleave", () => {
        if (!isPinnedOpen) {
          closeMenu();
        }
      });

      if (summary) {
        summary.addEventListener("click", (event) => {
          event.preventDefault();
          isPinnedOpen = !isPinnedOpen;
          if (isPinnedOpen) {
            openMenu();
          } else {
            closeMenu();
          }
        });
      }

      document.addEventListener("click", (event) => {
        if (!projectsMenu.contains(event.target)) {
          isPinnedOpen = false;
          closeMenu();
        }
      });
    }
  }

  // Load footer
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}
