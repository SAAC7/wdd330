import { loadHeaderFooter, qs } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// 1. lOAD THE HEADER AND FOOTER
loadHeaderFooter();

// 2. Instance the class (we use “so-cart,” which is the key in your localStorage)
const myCheckout = new CheckoutProcess("so-cart", "#order-summary");

// 3. Initialize (this will display the subtotal immediately)
myCheckout.init();

// 4. Listen for when the user leaves the ZIP code field
// We use the “blur” event to automatically calculate the totals when the user finishes typing
qs("#zip").addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
});

// 5. Listen to the form submission
qs("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Here we will call the send method in the next step
    myCheckout.checkout(e.target);
});