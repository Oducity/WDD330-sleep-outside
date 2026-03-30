import { loadHeaderFooter, alertMessage } from "./utils.mjs";
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

		// ✅ HTML Validation
		if (!checkoutForm.checkValidity()) {
			checkoutForm.reportValidity();
			return;
		}

		checkout.calculateOrderTotal();

		const result = await checkout.checkout(checkoutForm);

		// 🚨 Show an alert if it fails
		if (!result) {
			alertMessage(
				"There was an error processing your order. Please check your information and try again."
			);
			return;
		}

		// 🎉 Success
		localStorage.removeItem("so-cart");
		window.location.href = "/checkout/success.html";
	});
}