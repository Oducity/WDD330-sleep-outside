import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) throw new Error("Product not found");
    this.renderProductDetails();
    document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage(CART_KEY) || [];
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage(CART_KEY, cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
