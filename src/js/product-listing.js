import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

await listing.init();

const sortSelect = document.querySelector("#sortProducts");
if (sortSelect) {
  sortSelect.addEventListener("change", (event) => {
    listing.sortBy(event.target.value);
  });
}
