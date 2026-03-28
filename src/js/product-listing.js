import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

// get category from URL
const category = getParam("category") || "tents";

// update page title
const titleElement = document.querySelector(".title");

if (titleElement && category) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

// create data source
const dataSource = new ExternalServices();

// select element
const element = document.querySelector(".product-list");

// create product list
if (element) {
  const productList = new ProductList(category, dataSource, element);
  productList.init();
}