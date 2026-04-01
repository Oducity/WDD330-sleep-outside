import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
} from "./utils.mjs";

const CART_KEY = "so-cart";

function cartItemTemplate(item) {
  const quantity = Number(item.quantity) || 1;
  const unitPrice = Number(item.FinalPrice || 0);
  const lineTotal = quantity * unitPrice;
  const image = item.Image || item.Images?.PrimaryMedium || "";

  return `<li class="cart-card divider" data-id="${item.Id}">
    <button class="cart-remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name}">
      &times;
    </button>
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>

    <p class="cart-card__quantity">
      <button class="qty-minus" data-id="${item.Id}">-</button>
      <span>${quantity}</span>
      <button class="qty-plus" data-id="${item.Id}">+</button>
    </p>

    <p class="cart-card__price">$${lineTotal.toFixed(2)}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(listElement, cartKey = CART_KEY) {
    this.listElement = listElement;
    this.cartKey = cartKey;
  }

  init() {
    this.renderCartContents();
    this.addEventListeners();
  }

  getCartItems() {
    return getLocalStorage(this.cartKey) || [];
  }

  saveCartItems(items) {
    setLocalStorage(this.cartKey, items);
  }

  normalizeCartItems(items) {
    return items.reduce((normalized, item) => {
      if (!item || !item.Id || !item.Name) return normalized;

      const existing = normalized.find((product) => product.Id === item.Id);
      const quantity = Number(item.quantity) || 1;
      const image = item.Image || item.Images?.PrimaryMedium || "";

      if (existing) {
        existing.quantity += quantity;
      } else {
        normalized.push({ ...item, Image: image, quantity });
      }
      return normalized;
    }, []);
  }

  calculateTotal(items) {
    return items.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantity) || 1) * Number(item.FinalPrice || 0),
      0
    );
  }

  updateCartFooter(items) {
    const footer = document.querySelector(".cart-footer");
    const totalElement = document.querySelector(".cart-total");
    if (!footer || !totalElement) return;

    if (!items.length) {
      footer.classList.add("hide");
      totalElement.textContent = "Total: ";
      return;
    }

    footer.classList.remove("hide");
    totalElement.textContent = `Total: $${this.calculateTotal(items).toFixed(
      2
    )}`;
  }

  renderCartContents() {
    const items = this.normalizeCartItems(this.getCartItems());
    this.saveCartItems(items);

    this.listElement.innerHTML = "";

    if (!items.length) {
      this.listElement.innerHTML =
        '<li class="cart-empty">There is nothing in the cart</li>';
    } else {
      renderListWithTemplate(cartItemTemplate, this.listElement, items);
    }

    this.updateCartFooter(items);
  }

  // ➕ AUMENTAR
  increaseQuantity(id) {
    const items = this.getCartItems();
    const item = items.find((i) => i.Id === id);
    if (item) {
      item.quantity = (item.quantity || 1) + 1;
      this.saveCartItems(items);
      this.renderCartContents();
    }
  }

  // ➖ DISMINUIR
  decreaseQuantity(id) {
    const items = this.getCartItems();
    const item = items.find((i) => i.Id === id);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeCartItem(id);
        return;
      }
      this.saveCartItems(items);
      this.renderCartContents();
    }
  }

  removeCartItem(id) {
    const items = this.normalizeCartItems(this.getCartItems());
    const existing = items.find((item) => item.Id === id);
    if (!existing) return;

    if (existing.quantity > 1) {
      existing.quantity -= 1;
      this.saveCartItems(items);
    } else {
      this.saveCartItems(items.filter((item) => item.Id !== id));
    }

    this.renderCartContents();
  }

  addEventListeners() {
    this.listElement.addEventListener("click", (event) => {

      // ❌ eliminar
      const removeButton = event.target.closest(".cart-remove");
      if (removeButton) {
        const id = removeButton.dataset.id;
        if (id) this.removeCartItem(id);
        return;
      }

      // ➕ aumentar
      const plusButton = event.target.closest(".qty-plus");
      if (plusButton) {
        const id = plusButton.dataset.id;
        if (id) this.increaseQuantity(id);
        return;
      }

      // ➖ disminuir
      const minusButton = event.target.closest(".qty-minus");
      if (minusButton) {
        const id = minusButton.dataset.id;
        if (id) this.decreaseQuantity(id);
        return;
      }

    });
  }
}