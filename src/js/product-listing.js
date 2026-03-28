import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

// obtener categoría desde URL
const category = getParam("category") || "tents";

// actualizar título
const titleElement = document.querySelector(".title");
if (titleElement) {
  const formattedCategory = category.replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

// data source correcto (tu backend)
const dataSource = new ProductData();

// elemento donde renderiza
const element = document.querySelector(".product-list");

// crear lista
const productList = new ProductList(category, dataSource, element);

// inicializar
productList.init();