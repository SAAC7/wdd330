import { loadHeaderFooter, qs } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
loadHeaderFooter();
const myCheckout = new CheckoutProcess("so-cart", "#order-summary");
myCheckout.init();
qs("#zip").addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
});
qs("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    removeAllAlerts();
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