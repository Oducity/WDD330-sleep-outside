import ExternalServices from "./ExternalServices.mjs";
import { formDataToJSON, getLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice || 0),
    quantity: Number(item.quantity) || 1,
  }));
}

export default class CheckoutProcess {
  constructor(cartKey = CART_KEY, externalServices = new ExternalServices()) {
    this.cartKey = cartKey;
    this.externalServices = externalServices;
    this.subtotal = 0;
    this.discount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  getCartItems() {
    return getLocalStorage(this.cartKey) || [];
  }

  calculateOrderSubtotal() {
    const items = this.getCartItems();

    this.subtotal = items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1) * Number(item.FinalPrice || 0),
      0,
    );

    this.discount = items.reduce((sum, item) => {
      const srp = Number(item.SuggestedRetailPrice || 0);
      const final = Number(item.FinalPrice || 0);
      const qty = Number(item.quantity) || 1;
      return srp > final ? sum + (srp - final) * qty : sum;
    }, 0);

    this.updateAmount("subtotal", this.subtotal);
    this.updateAmount("discount", this.discount);
  }

  calculateOrderTotal() {
    const items = this.getCartItems();
    const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.tax = this.subtotal * 0.06;
    this.orderTotal = this.subtotal - this.discount + this.shipping + this.tax;

    this.updateAmount("shipping", this.shipping);
    this.updateAmount("tax", this.tax);
    this.updateAmount("order-total", this.orderTotal);
  }

  updateAmount(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = `$${value.toFixed(2)}`;
  }

  async checkout(form) {
    try {
      const formData = new FormData(form);
      const orderData = formDataToJSON(formData);

      orderData.orderDate = new Date().toISOString();
      orderData.items = packageItems(this.getCartItems());
      orderData.tax = this.tax.toFixed(2);
      orderData.shipping = this.shipping;
      orderData.orderTotal = this.orderTotal.toFixed(2);

      const result = await this.externalServices.checkout(orderData);

      console.log("Orden exitosa:", result);

      return result;

    } catch (err) {
      console.error("Error en checkout:", err);

      // Aquí luego mostraremos el error al usuario (PASO 6)
      return null;
    }
  }
}