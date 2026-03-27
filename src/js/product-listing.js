import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

await listing.init();

const sortSelect = document.querySelector("#sortProducts");
if (sortSelect) {
  sortSelect.addEventListener("change", (event) => {
    listing.sortBy(event.target.value);
  });
}
