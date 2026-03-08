import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get localStorage with the id "so-cart" and assign it to itemsInCart or
  // declare itemsInCart as empty array if "so-cart" not found in localStorage.
  const itemsInCart = getLocalStorage("so-cart") || [];
  itemsInCart.push(product);
  setLocalStorage("so-cart", itemsInCart);
  //localStorage.clear();
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
