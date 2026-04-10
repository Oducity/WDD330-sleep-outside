import { getLocalStorage, setLocalStorage, alertMessage} from "./utils.mjs";

const CART_KEY = "so-cart";
const WISHLIST_KEY = "so-wishlist";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.selectedColor = null;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) throw new Error("Product not found");
    this.selectedColor = this.product.Colors?.[0] || null;
    this.renderProductDetails();
    document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
    document.getElementById("addToWishlist").addEventListener("click", this.addToWishlist.bind(this));
  }

  selectColor(color) {
    this.selectedColor = color;
    // Update main image to the selected color's preview
    const productImage = document.getElementById("productImage");
    if (color.ColorPreviewImageSrc) {
      productImage.src = color.ColorPreviewImageSrc.replace("~160.jpg", "~600.jpg");
    }
    // Update active state on all swatches
    document.querySelectorAll(".color-swatch").forEach((btn) => {
      btn.classList.toggle("color-swatch--selected", btn.dataset.colorCode === color.ColorCode);
      btn.setAttribute("aria-pressed", btn.dataset.colorCode === color.ColorCode ? "true" : "false");
    });
  }

  addProductToCart() {
    const cartItems = getLocalStorage(CART_KEY) || [];
    const selectedColorName = this.selectedColor?.ColorName || this.product.Colors?.[0]?.ColorName || null;
    const existingItem = cartItems.find(
      (item) => item.Id === this.product.Id && (item.selectedColor || null) === selectedColorName
    );

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      const cartProduct = {
        ...this.product,
        Image: this.product.Images?.PrimaryMedium || this.product.Image,
        selectedColor: selectedColorName,
        quantity: 1,
      };
      cartItems.push(cartProduct);
    }

    setLocalStorage(CART_KEY, cartItems);
  }

  addToWishlist() {
    const wishlist = getLocalStorage(WISHLIST_KEY) || [];
    const selectedColorName = this.selectedColor?.ColorName || this.product.Colors?.[0]?.ColorName || null;
    const already = wishlist.find(
      (item) => item.Id === this.product.Id && (item.selectedColor || null) === selectedColorName
    );
    if (already) {
      alertMessage(`${this.product.Name} is already in your wishlist.`);
      return;
    }
    wishlist.push({
      ...this.product,
      Image: this.product.Images?.PrimaryMedium || this.product.Image,
      selectedColor: selectedColorName,
    });
    setLocalStorage(WISHLIST_KEY, wishlist);
    alertMessage(`${this.product.Name} added to your wishlist! ♥`);
  }
  
  renderProductDetails() {
    productDetailsTemplate(this.product, this.selectColor.bind(this));
  }
}

function productDetailsTemplate(product, onColorSelect) {
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

  const colorContainer = document.getElementById("productColor");
  const colors = product.Colors || [];

  if (colors.length <= 1) {
    // Single color — just show the name as text
    colorContainer.textContent = colors[0]?.ColorName || "";
  } else {
    // Multiple colors — render swatches
    const label = document.createElement("p");
    label.className = "color-swatch__label";
    label.textContent = `Color: ${colors[0].ColorName}`;
    colorContainer.appendChild(label);

    const swatchList = document.createElement("div");
    swatchList.className = "color-swatch__list";

    colors.forEach((color, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-swatch" + (index === 0 ? " color-swatch--selected" : "");
      btn.dataset.colorCode = color.ColorCode;
      btn.setAttribute("aria-label", color.ColorName);
      btn.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      btn.title = color.ColorName;

      if (color.ColorChipImageSrc) {
        const img = document.createElement("img");
        img.src = color.ColorChipImageSrc;
        img.alt = color.ColorName;
        btn.appendChild(img);
      } else {
        btn.textContent = color.ColorName;
      }

      btn.addEventListener("click", () => {
        label.textContent = `Color: ${color.ColorName}`;
        onColorSelect(color);
      });

      swatchList.appendChild(btn);
    });

    colorContainer.appendChild(swatchList);
  }

  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}
