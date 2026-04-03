import { loadHeaderFooter, getParam, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

// get category from URL
const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const titleElement = document.querySelector(".title");
const listing = new ProductList(category, dataSource, element);

try {
  await listing.init();
} catch (err) {
  alertMessage("Unable to load products right now. Please try again in a moment.");
}

if (titleElement && category) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}
