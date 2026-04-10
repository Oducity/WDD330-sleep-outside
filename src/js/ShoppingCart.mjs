import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
} from "./utils.mjs";

const CART_KEY = "so-cart";

function getItemColorName(item) {
  return item.selectedColor || item.Colors?.[0]?.ColorName || "";
}

function getItemKey(item) {
  return `${item.Id}::${getItemColorName(item)}`;
}

function cartItemTemplate(item) {
  const quantity = Number(item.quantity) || 1;
  const unitPrice = Number(item.FinalPrice || 0);
  const lineTotal = quantity * unitPrice;
  const image = item.Image || item.Images?.PrimaryMedium || "";
  const itemKey = getItemKey(item);
  const multipleClass = quantity > 1 ? " cart-card--multiple" : "";

  return `<li class="cart-card divider${multipleClass}" data-id="${item.Id}" data-item-key="${itemKey}">
    <button class="cart-remove" type="button" data-item-key="${itemKey}" aria-label="Remove ${item.Name}">
      &times;
    </button>
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${getItemColorName(item)}</p>

    <p class="cart-card__quantity">
      <button class="qty-button qty-plus" type="button" data-item-key="${itemKey}" aria-label="Increase quantity">+</button>
      <span class="qty-value">qty ${quantity}</span>
      <button class="qty-button qty-minus" type="button" data-item-key="${itemKey}" aria-label="Decrease quantity">-</button>
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

      const quantity = Number(item.quantity) || 1;
      const image = item.Image || item.Images?.PrimaryMedium || "";
      const itemColor = getItemColorName(item);
      const existing = normalized.find((product) => getItemKey(product) === `${item.Id}::${itemColor}`);

      if (existing) {
        existing.quantity += quantity;
      } else {
        normalized.push({ ...item, Image: image, selectedColor: itemColor, quantity });
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
        "<li class=\"cart-empty\">There is nothing in the cart</li>";
    } else {
      renderListWithTemplate(cartItemTemplate, this.listElement, items);
    }

    this.updateCartFooter(items);
  }

  // ➕ AUMENTAR
  increaseQuantity(itemKey) {
    const items = this.getCartItems();
    const item = items.find((i) => getItemKey(i) === itemKey);
    if (item) {
      item.quantity = (item.quantity || 1) + 1;
      this.saveCartItems(items);
      this.renderCartContents();
    }
  }

  // ➖ DISMINUIR
  decreaseQuantity(itemKey) {
    const items = this.getCartItems();
    const item = items.find((i) => getItemKey(i) === itemKey);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeCartItem(itemKey);
        return;
      }
      this.saveCartItems(items);
      this.renderCartContents();
    }
  }

  removeCartItem(itemKey) {
    const items = this.normalizeCartItems(this.getCartItems());
    const existing = items.find((item) => getItemKey(item) === itemKey);
    if (!existing) return;

    if (existing.quantity > 1) {
      existing.quantity -= 1;
      this.saveCartItems(items);
    } else {
      this.saveCartItems(items.filter((item) => getItemKey(item) !== itemKey));
    }

    this.renderCartContents();
  }

  addEventListeners() {
    this.listElement.addEventListener("click", (event) => {
      const plusButton = event.target.closest(".qty-plus");
      if (plusButton) {
        const itemKey = plusButton.dataset.itemKey;
        if (itemKey) this.increaseQuantity(itemKey);
        return;
      }

      const minusButton = event.target.closest(".qty-minus");
      if (minusButton) {
        const itemKey = minusButton.dataset.itemKey;
        if (itemKey) this.decreaseQuantity(itemKey);
        return;
      }

      // ❌ eliminar
      const removeButton = event.target.closest(".cart-remove");
      if (removeButton) {
        const itemKey = removeButton.dataset.itemKey;
        if (itemKey) this.removeCartItem(itemKey);
        return;
      }

    });
  }
}
