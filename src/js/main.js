import ProductData from "./ProductData.mjs";
import ProductList from "./ProductData.mjs";
import alert from "./alert.mjs";

const alertData = new alert("../public/json/alert.json");
const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

alertData.getAlertData();
productList.init();
import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

