import { getParam, loadHeaderFooter} from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import alert from "./alert.mjs";

const alertData = new alert("../public/json/alert.json");
const dataSource = new ProductData();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

 // add to cart button event handler
// async function addToCartHandler(e) {
//     const product = await dataSource.findProductById(e.target.dataset.id);
//     addProductToCart(product);
// }
 
//  // add listener to Add to Cart button
//  document
//    .getElementById("addToCart")
//    .addEventListener("click", addToCartHandler);
loadHeaderFooter();
alertData.getAlertData();
