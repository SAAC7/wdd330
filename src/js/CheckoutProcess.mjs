import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, removeAllAlerts } from "./utils.mjs";
function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
        convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

// Function to simplify cart items for the API
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubtotal();
    }

    calculateItemSubtotal() {
        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
        subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {

        // 1. Calculate Taxes (6%)

        this.tax = this.itemTotal * 0.06;

        // 2. Calculate shipping ($10 for the first item, $2 for each additional item)
        if (this.list.length > 0) {
            this.shipping = 10 + (this.list.length - 1) * 2;
        } else {
            this.shipping = 0;
        }

        // 3. Add everything up to get the final total

        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        // 4. Display on screen

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const orderTotalElement = document.querySelector(`${this.outputSelector} #order-total`);

        shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        taxElement.innerText = `$${this.tax.toFixed(2)}`;
        orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    // Inside the CheckoutProcess class in CheckoutProcess.mjs

    // ... same imports and constructor ...

    async checkout(form) {
        const json = formDataToJSON(form);

        // Add required fields with the correct format

        json.orderDate = new Date().toISOString();
        json.orderTotal = this.orderTotal.toFixed(2);
        json.tax = this.tax.toFixed(2);
        json.shipping = this.shipping.toFixed(2);
        json.items = packageItems(this.list);

        const services = new ExternalServices();
        removeAllAlerts();
        try {
            const res = await services.checkout(json);
            console.log("Successful order:", res);

            // Clear cart and redirect

            localStorage.removeItem(this.key);
            location.assign("/checkout/success.html");
        } catch (err) {
            console.error("Order error:", err);

            removeAllAlerts();

            if (err.message && typeof err.message === 'object') {
                const errorMsg = Object.values(err.message).join("<br>");
                alertMessage(errorMsg);
            } else {
                alertMessage("An error occurred while processing the order.");
            }
        }
    }
}