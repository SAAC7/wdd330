import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  const discountPercent = isDiscounted
    ? Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
      100
    )
    : 0;

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      ${isDiscounted
      ? `<span class="discount-badge">-${discountPercent}%</span>`
      : ""
    }
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">
        $${product.FinalPrice}
        ${isDiscounted
      ? `<span class="original-price">$${product.SuggestedRetailPrice}</span>`
      : ""
    }
      </p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    // Creamos una variable para guardar los productos
    this.list = [];
  }

  async init() {
    // Guardamos los datos recibidos en la variable de la clase
    this.list = await this.dataSource.getData(this.category);

    this.renderList(this.list);

    const titleElement = document.querySelector("#listing-title");
    if (titleElement) {
      titleElement.innerHTML = `Top Products: ${this.category}`;
    }
  }

  // Método para ordenar la lista
  sortList(criterion) {
    if (criterion === "name") {
      // Ordenamos por nombre (A-Z)
      this.list.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (criterion === "price") {
      // Ordenamos por precio (Menor a Mayor)
      this.list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    // Limpiamos el HTML antes de volver a renderizar
    this.listElement.innerHTML = "";
    this.renderList(this.list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}