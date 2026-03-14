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
        // Usamos los IDs exactos de tu HTML
        document.getElementById("productName").innerText = this.product.Name;
        document.getElementById("productBrandName").innerText = this.product.Brand.Name;

        // OJO: La ruta de la imagen en el JSON suele ser product.Images.PrimaryLarge
        const imgElement = document.getElementById("productImage");
        imgElement.src = this.product.Images?.PrimaryLarge || this.product.Image;
        imgElement.alt = this.product.Name;

        document.getElementById("productFinalPrice").innerText = `$${this.product.FinalPrice}`;
        document.getElementById("productColorName").innerText = this.product.Colors[0].ColorName;
        document.getElementById("productDescriptionHtmlSimple").innerHTML = this.product.DescriptionHtmlSimple;

        // Actualizamos el ID en el botón por si acaso
        document.getElementById("addToCart").dataset.id = this.product.Id;
    }
}