import { getLocalStorage, setLocalStorage, alertMessage} from "./utils.mjs";

const CART_KEY = "so-cart";
const WISHLIST_KEY = "so-wishlist";

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
    document.getElementById("addToWishlist").addEventListener("click", this.addToWishlist.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage(CART_KEY) || [];
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      const cartProduct = {
        ...this.product,
        Image: this.product.Images?.PrimaryMedium || this.product.Image,
        quantity: 1,
      };
      cartItems.push(cartProduct);
    }

    setLocalStorage(CART_KEY, cartItems);
  }

  addToWishlist() {
    const wishlist = getLocalStorage(WISHLIST_KEY) || [];
    const already = wishlist.find((item) => item.Id === this.product.Id);
    if (already) {
      alertMessage(`${this.product.Name} is already in your wishlist.`);
      return;
    }
    wishlist.push({
      ...this.product,
      Image: this.product.Images?.PrimaryMedium || this.product.Image,
    });
    setLocalStorage(WISHLIST_KEY, wishlist);
    alertMessage(`${this.product.Name} added to your wishlist! ♥`);
  }
  
  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images?.PrimaryLarge || product.Image;
  productImage.alt = product.NameWithoutBrand;
  document.getElementById("productPrice").textContent = product.FinalPrice;
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const span = document.createElement("span");
    const discount = product.SuggestedRetailPrice - product.FinalPrice;
    span.innerText = `Discount: ${discount}`;
    document.getElementById("productPrice").appendChild(span);
  }
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
