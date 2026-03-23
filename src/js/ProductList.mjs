import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return 
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);
    this.renderList(this.products);
  }
  sortBy(sortValue) {
    const sorted = [...this.products];

    switch (sortValue) {
      case "name-asc":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      case "price-asc":
        sorted.sort((a, b) => Number(a.FinalPrice) - Number(b.FinalPrice));
        break;
      case "price-desc":
        sorted.sort((a, b) => Number(b.FinalPrice) - Number(a.FinalPrice));
        break;
      default:
        break;
    }

    this.renderList(sorted);
  }
  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }
}
