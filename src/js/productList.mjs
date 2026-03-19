import { renderListWithTemplate } from "./utils.mjs";

function formatCategoryName(category = "") {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function productCardTemplate(product, category) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}&category=${category}">
        <img src="${product.Images?.PrimaryMedium || ""}" alt="${product.Name}">
        <h2>${product.Brand?.Name || ""}</h2>
        <h3>${product.Name}</h3>
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
    this.originalList = [];
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.originalList = list;
    this.updateTitle();
    this.renderList(list);
    this.initSort();
  }

  updateTitle() {
    const titleElement = document.querySelector(".title");
    if (!titleElement) return;
    titleElement.textContent = formatCategoryName(this.category);
  }

  initSort() {
    const sortSelect = document.querySelector("#sortProducts");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", (event) => {
      const sorted = this.sortProducts([...this.originalList], event.target.value);
      this.renderList(sorted);
    });
  }

  sortProducts(list, sortBy) {
    switch (sortBy) {
      case "name-asc":
        return list.sort((a, b) => a.Name.localeCompare(b.Name));
      case "name-desc":
        return list.sort((a, b) => b.Name.localeCompare(a.Name));
      case "price-asc":
        return list.sort((a, b) => Number(a.FinalPrice) - Number(b.FinalPrice));
      case "price-desc":
        return list.sort((a, b) => Number(b.FinalPrice) - Number(a.FinalPrice));
      default:
        return list;
    }
  }

  renderList(list) {
    const template = (product) => productCardTemplate(product, this.category);
    renderListWithTemplate(template, this.listElement, list, "afterbegin", true);
  }
}
