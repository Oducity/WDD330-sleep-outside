import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";
const productListEl = document.querySelector(".product-list");

function getCartItems() {
  return getLocalStorage(CART_KEY) || [];
}

function saveCartItems(items) {
  setLocalStorage(CART_KEY, items);
}

function normalizeCartItems(items) {
  return items.reduce((normalizedItems, item) => {
    if (!item || !item.Id || !item.Image || !item.Name) {
      return normalizedItems;
    }

    const existingItem = normalizedItems.find(
      (normalizedItem) => normalizedItem.Id === item.Id,
    );
    const quantity = Number(item.quantity) || 1;

    if (existingItem) {
      existingItem.quantity += quantity;
      return normalizedItems;
    }

    normalizedItems.push({ ...item, quantity });
    return normalizedItems;
  }, []);
}

function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + ((item.quantity || 1) * Number(item.FinalPrice || 0)), 0);
}

function updateCartFooter(items) {
  const footer = document.querySelector(".cart-footer");
  const totalEl = document.querySelector(".cart-total");

  if (!footer || !totalEl) return;

  if (items.length === 0) {
    footer.classList.add("hide");
    totalEl.textContent = "Total: ";
    return;
  }

  footer.classList.remove("hide");
  const total = calculateCartTotal(items);
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const quantity = Number(item.quantity) || 1;
  const itemTotal = quantity * Number(item.FinalPrice || 0);

  return `<li class="cart-card divider" data-id="${item.Id}">
  <button class="cart-remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name}">
    &times;
  </button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${itemTotal.toFixed(2)}</p>
</li>`;
}


function renderCartContents() {
  const cartItems = normalizeCartItems(getCartItems());
  saveCartItems(cartItems);

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productListEl.innerHTML = htmlItems.join("");
  updateCartFooter(cartItems);
}

function removeCartItem(id) {
  const cartItems = normalizeCartItems(getCartItems());
  const existingItem = cartItems.find((item) => item.Id === id);

  if (!existingItem) {
    return;
  }

  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1;
    saveCartItems(cartItems);
  } else {
    saveCartItems(cartItems.filter((item) => item.Id !== id));
  }

  renderCartContents();
}

productListEl.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-remove");
  if (!removeButton) return;

  const id = removeButton.dataset.id;
  if (!id) return;

  removeCartItem(id);
});

renderCartContents();
