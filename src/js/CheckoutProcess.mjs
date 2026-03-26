import { getLocalStorage, qs } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Función auxiliar para convertir el formulario en un objeto JSON limpio
function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
        convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

// Función para simplificar los items del carrito para la API
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1, // En este proyecto solemos manejar cantidad 1 por simplificación
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
        // Sumamos el precio final de cada producto en la lista
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
        subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        // 1. Calcular Impuestos (6%)
        this.tax = this.itemTotal * 0.06;

        // 2. Calcular Envío ($10 por el primero, $2 por cada adicional)
        if (this.list.length > 0) {
            this.shipping = 10 + (this.list.length - 1) * 2;
        } else {
            this.shipping = 0;
        }

        // 3. Sumar todo para el Total Final
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        // 4. Mostrar en pantalla
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

    // Dentro de la clase CheckoutProcess en CheckoutProcess.mjs

    // ... importaciones y constructor igual ...

    async checkout(form) {
        const json = formDataToJSON(form);

        // Agregar campos requeridos con formato correcto
        json.orderDate = new Date().toISOString();
        json.orderTotal = this.orderTotal.toFixed(2);
        json.tax = this.tax.toFixed(2);
        json.shipping = this.shipping;
        json.items = packageItems(this.list);

        const services = new ExternalServices();

        try {
            const res = await services.checkout(json);
            console.log("Orden exitosa:", res);

            // Limpiar carrito y redirigir
            localStorage.removeItem(this.key);
            location.assign("/checkout/success.html");

        } catch (err) {
            // Si el servidor responde con 400, aquí veremos por qué
            console.error("Error en la orden:", err);

            // Opcional: mostrar una alerta con el error específico
            if (err.message && typeof err.message === 'object') {
                const errorMsg = Object.values(err.message).join("\n");
                alert("Problemas con los datos:\n" + errorMsg);
            }
        }
    }
}