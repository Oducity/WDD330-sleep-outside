import ProductList from "./productList.mjs";
import productData from "./ProductData.mjs";

const comingData = new productData("tents");
const element = document.querySelector(".parent-list");
const productListInstance = new ProductList("Tents", comingData, element);
productListInstance.init();