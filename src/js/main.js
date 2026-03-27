import alert from "./alert.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);
const alertData = new alert("../public/json/alert.json");

alertData.getAlertData();
productList.init();
loadHeaderFooter();