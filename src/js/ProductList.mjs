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
      
      ${
        isDiscounted
          ? `<span class="discount-badge">-${discountPercent}%</span>`
          : ""
      }

      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>

      <p class="product-card__price">
        $${product.FinalPrice}
        ${
          isDiscounted
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
    }

    async init() {
        const list = await this.dataSource.getData(this.category);

        
        const filteredList = list.filter(product =>
            product.Id !== "989CG" && product.Id !== "880RT"
        );

        this.renderList(filteredList);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}