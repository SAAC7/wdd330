import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // 1. Buscamos los datos
        this.product = await this.dataSource.findProductById(this.productId);

        // 2. Si el producto existe, dibujamos y activamos el botón
        if (this.product) {
            this.renderProductDetails();
            document.getElementById("addToCart")
                .addEventListener("click", this.addToCart.bind(this));
        } else {
            console.error("No se encontró el producto con ID:", this.productId);
        }
    }

    addToCart() {
        let cartContent = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cartContent)) cartContent = [];

        cartContent.push(this.product);
        setLocalStorage("so-cart", cartContent);

    }

    renderProductDetails() {
        const product = this.product;

        const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

        const discountAmount = isDiscounted
            ? Number((product.SuggestedRetailPrice - product.FinalPrice).toFixed(2))
            : 0;

        const discountPercent = isDiscounted
            ? Math.round((discountAmount / product.SuggestedRetailPrice) * 100)
            : 0;

        // Nombre y marca
        document.getElementById("productName").innerText = product.Name;
        document.getElementById("productBrandName").innerText = product.Brand.Name;

        // Imagen
        const imgElement = document.getElementById("productImage");
        imgElement.src = product.Images?.PrimaryLarge || product.Image;
        imgElement.alt = product.Name;

        // 💰 Precio (AQUÍ está lo importante)
        const priceElement = document.getElementById("productFinalPrice");

        priceElement.innerHTML = `
        $${product.FinalPrice}
        ${isDiscounted
                ? `<span class="original-price">$${product.SuggestedRetailPrice}</span>`
                : ""
            }
    `;

        // 🟢 Indicador de descuento
        let discountElement = document.getElementById("discountInfo");

        // si no existe en el HTML, lo creamos
        if (!discountElement) {
            discountElement = document.createElement("p");
            discountElement.id = "discountInfo";
            priceElement.parentElement.appendChild(discountElement);
        }

        discountElement.innerHTML = isDiscounted
            ? `You save $${discountAmount} (${discountPercent}% OFF)`
            : "";

        // Otros datos
        document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
        document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;

        document.getElementById("addToCart").dataset.id = product.Id;
    }
}