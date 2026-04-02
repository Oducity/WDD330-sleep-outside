import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

loadHeaderFooter();

const WISHLIST_KEY = "so-wishlist";
const CART_KEY = "so-cart";

function wishlistItemTemplate(item) {
  const image = item.Image || item.Images?.PrimaryMedium || "";
  return `<li class="cart-card divider" data-id="${item.Id}">
    <button class="wishlist-remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name}">&times;</button>
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__price">$${Number(item.FinalPrice || 0).toFixed(2)}</p>
    <button class="wishlist-to-cart button" type="button" data-id="${item.Id}">Move to Cart</button>
  </li>`;
}

function renderWishlist() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  const items = getLocalStorage(WISHLIST_KEY) || [];
  if (!items.length) {
    list.innerHTML = "<li class='cart-empty'>Your wishlist is empty.</li>";
    return;
  }
  list.innerHTML = items.map(wishlistItemTemplate).join("");
}

function moveToCart(id) {
  const wishlist = getLocalStorage(WISHLIST_KEY) || [];
  const item = wishlist.find((i) => i.Id === id);
  if (!item) return;

  // Add to cart
  const cart = getLocalStorage(CART_KEY) || [];
  const existing = cart.find((i) => i.Id === id);
  if (existing) {
    existing.quantity = (Number(existing.quantity) || 1) + 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  setLocalStorage(CART_KEY, cart);

  // Remove from wishlist
  setLocalStorage(WISHLIST_KEY, wishlist.filter((i) => i.Id !== id));
  alertMessage(`${item.Name} moved to cart!`);
  renderWishlist();
}

function removeFromWishlist(id) {
  const wishlist = getLocalStorage(WISHLIST_KEY) || [];
  setLocalStorage(WISHLIST_KEY, wishlist.filter((i) => i.Id !== id));
  renderWishlist();
}

document.querySelector(".product-list").addEventListener("click", (event) => {
  const moveBtn = event.target.closest(".wishlist-to-cart");
  const removeBtn = event.target.closest(".wishlist-remove");

  if (moveBtn) moveToCart(moveBtn.dataset.id);
  if (removeBtn) removeFromWishlist(removeBtn.dataset.id);
});

renderWishlist();
