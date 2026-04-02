import { loadHeaderFooter, getParam, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { ProductList, displayDialog } from "./ProductList.mjs";

loadHeaderFooter();

// get category from URL
const category = getParam("category") || "tents";

try {
  await listing.init();
} catch (err) {
  alertMessage("Unable to load products right now. Please try again in a moment.");
}

if (titleElement && category) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const productCards = document.querySelectorAll(".product-card");
displayDialog(productCards);
