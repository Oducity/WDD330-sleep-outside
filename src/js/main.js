import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Product list setup
const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, element);
productList.init();

// Alerts
const alertData = new alert("../public/json/alert.json");
alertData.getAlertData();