import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Product list setup
const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

alertData.getAlertData();
productList.init();
import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

