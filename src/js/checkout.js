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
    await checkout.checkout(checkoutForm);
	});
}
