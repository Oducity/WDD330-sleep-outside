import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// get category from the URL
const category = getParam("category");

// update page title
const titleElement = document.querySelector(".title");

if (category) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

// create a data source
const dataSource = new ProductData();

// select the element where it is rendered
const element = document.querySelector(".product-list");

// create a product list
const productList = new ProductList(category, dataSource, element);

// initialize
productList.init();