import productList from "./productList.mjs";
import productData from "./ProductData.mjs";





const comingData = new productData("tents");
const element = document.querySelector(".parent-list");
const productList = new productList("Tents", comingData, element);

productList.init();