import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import productDetails from "./productDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");
const product = new productDetails(productId, dataSource);
product.init;

//// add to cart button event handler
//async function addToCartHandler(e) {
//  const product = await dataSource.findProductById(e.target.dataset.id);
//  addProductToCart(product);
//}
