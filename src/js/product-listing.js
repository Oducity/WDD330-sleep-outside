import { loadHeaderFooter, getParam, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

try {
  await listing.init();
} catch (err) {
  alertMessage("Unable to load products right now. Please try again in a moment.");
}

const sortSelect = document.querySelector("#sortProducts");
if (sortSelect) {
  sortSelect.addEventListener("change", (event) => {
    listing.sortBy(event.target.value);
  });
}
