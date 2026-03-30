// 🔥 PASO 1: Agregar renderBreadcrumbs al import
import { setLocalStorage, getLocalStorage, updateCartCount, renderBreadcrumbs } from "./utils.mjs";

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
            // 🔥 PASO 2: Ahora sí funcionará porque ya está importado arriba
            renderBreadcrumbs(this.product.Category);

            this.renderProductDetails();
            document.getElementById("addToCart")
                .addEventListener("click", this.addToCart.bind(this));
        } else {
            console.error("No se encontró el producto con ID:", this.productId);
        }
    }

    // ... (el resto de tu código addToCart y renderProductDetails se queda igual)
    addToCart() {
        let cartContent = getLocalStorage("so-cart") || [];
        if (!Array.isArray(cartContent)) cartContent = [];

        const existingItem = cartContent.find(
            item => item.Id === this.product.Id
        );

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            const productToAdd = { ...this.product, quantity: 1 };
            cartContent.push(productToAdd);
        }
        setLocalStorage("so-cart", cartContent);
        updateCartCount();
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

        document.getElementById("productName").innerText = product.Name;
        document.getElementById("productBrandName").innerText = product.Brand.Name;

        const imgElement = document.getElementById("productImage");
        imgElement.src = product.Images.PrimaryLarge;
        imgElement.alt = product.Name;

        const priceElement = document.getElementById("productFinalPrice");
        priceElement.innerHTML = `
        $${product.FinalPrice}
        ${isDiscounted
                ? `<span class="original-price">$${product.SuggestedRetailPrice}</span>`
                : ""
            }
        `;

        const imageContainer = document.querySelector(".product-image-container");
        let discountElementBadage = document.getElementById("discountBadge");

        if (!discountElementBadage) {
            discountElementBadage = document.createElement("span");
            discountElementBadage.id = "discountBadge";
            imageContainer.appendChild(discountElementBadage);
        }

        let discountElement = document.getElementById("discountInfo");
        if (!discountElement) {
            discountElement = document.createElement("p");
            discountElement.id = "discountInfo";
            priceElement.parentElement.appendChild(discountElement);
        }

        discountElement.innerHTML = isDiscounted
            ? `You save $${discountAmount} (${discountPercent}% OFF)`
            : "";
        discountElementBadage.innerHTML = isDiscounted
            ? `-${discountPercent}% OFF`
            : "";

        document.getElementById("productColorName").innerText =
            product.Colors?.[0]?.ColorName || "N/A";

        document.getElementById("productDescriptionHtmlSimple").innerHTML =
            product.DescriptionHtmlSimple;

        document.getElementById("addToCart").dataset.id = product.Id;
    }
}