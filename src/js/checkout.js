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
export function alertMessage(message, scroll = true) {
    const alert = document.createElement("div");
    alert.classList.add("alert");
    alert.innerHTML = `<p>${message}</p><span>X</span>`;
    alert.addEventListener("click", function (e) {
        if (e.target.tagName === "SPAN") {
            main.removeChild(this);
        }
    });

    const main = document.querySelector("main");
    main.prepend(alert); 
    if (scroll) window.scrollTo(0, 0);
}
export function removeAllAlerts() {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => alert.remove());
}