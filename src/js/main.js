import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const alertData = new Alert("/json/alert.json");
alertData.getAlertData();

// setup product list (home page)
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

if (element) {
    const productList = new ProductList("tents", dataSource, element);
    productList.init();
}
