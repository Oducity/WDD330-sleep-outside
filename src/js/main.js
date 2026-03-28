import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const alertData = new Alert("../public/json/alert.json");
alertData.getAlertData();

// Ejecutar solo si existe product-list (evita errores)
const element = document.querySelector(".product-list");

if (element) {
    const dataSource = new ProductData("tents");
    const productList = new ProductList("Tents", dataSource, element);
    productList.init();
}