import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { ProductList, displayDialog } from "./ProductList.mjs";

loadHeaderFooter();

// get category from URL
const category = getParam("category") || "tents";

// update page title
const titleElement = document.querySelector(".title");

if (titleElement && category) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const productCards = document.querySelectorAll(".product-card");
displayDialog(productCards);
