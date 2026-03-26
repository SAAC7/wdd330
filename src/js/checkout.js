import { loadHeaderFooter, qs } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// 1. Cargar el encabezado y pie de página
loadHeaderFooter();

// 2. Instanciar la clase (usamos "so-cart" que es la llave de tu localStorage)
const myCheckout = new CheckoutProcess("so-cart", "#order-summary");

// 3. Inicializar (esto mostrará el subtotal de inmediato)
myCheckout.init();

// 4. Escuchar cuando el usuario sale del campo de código postal (ZIP)
// Usamos "blur" para que calcule los totales automáticamente al terminar de escribir
qs("#zip").addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
});

// 5. Escuchar el envío del formulario
qs("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Aquí llamaremos al método de envío en el siguiente paso
    myCheckout.checkout(e.target);
});