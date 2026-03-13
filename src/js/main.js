import productData from "./ProductData.mjs"
import productList from "./productList.mjs";
import productList from "./productList.mjs";





const comingData = new productData(productList);
const element = document.querySelector(".parent-list");
const productList = new productList("Tents", comingData, element);

productList.init();