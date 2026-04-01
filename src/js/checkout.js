import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess();
checkout.calculateOrderSubtotal();
checkout.calculateOrderTotal();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("change", () => {
    checkout.calculateOrderTotal();
  });
}

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    checkout.calculateOrderTotal();

    try {
      const result = await checkout.checkout(checkoutForm);
      localStorage.removeItem("so-cart");
      window.alert(result.message || "Order submitted successfully.");
      window.location.href = "/index.html";
    } catch (error) {
      window.alert(`Checkout failed: ${error.message}`);
    }
  });
}
