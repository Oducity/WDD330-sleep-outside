import productList from "./productList.mjs";
import productData from "./ProductData.mjs";





const comingData = new productData("tents");
const element = document.querySelector(".product-list");
const productList = new productList("Tents", comingData, element);

productList.init();