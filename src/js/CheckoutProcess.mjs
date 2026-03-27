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
        this.tax = this.itemTotal * 0.06;
        if (this.list.length > 0) {
            this.shipping = 10 + (this.list.length - 1) * 2;
        } else {
            this.shipping = 0;
        }
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
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

    async checkout(form) {
        const json = formDataToJSON(form); 

        json.orderDate = new Date().toISOString();
        json.orderTotal = this.orderTotal.toFixed(2);
        json.tax = this.tax.toFixed(2);
        json.shipping = this.shipping.toFixed(2);
        json.items = packageItems(this.list);

        const services = new ExternalServices();

        try {
            const res = await services.checkout(json);
            localStorage.removeItem(this.key);
            location.assign("/checkout/success.html");
        } catch (err) {
            removeAllAlerts(); 
            for (let key in err.message) {
                alertMessage(err.message[key]); 
            }
        }
    }
}