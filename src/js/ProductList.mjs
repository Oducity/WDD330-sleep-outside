import { renderListWithTemplate } from "./utils.mjs";
import { getDiscount } from "./getDiscount.mjs";

function productCardTemplate(product) {
  if (product.suggestedRetailPrice) {
    const discount = new getDiscount();
    const discountValue = discount(
      product.suggestedRetailPrice,
      product.FinalPrice,
    );
    return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.Name}">
          <h2>${product.Brand.Name}</h2>
          <h3>${product.NameWithoutBrand}</h3>
          <p class="product-card__price">$${product.FinalPrice} || <span>Discounted: ${discountValue}</span></p>
      </a>
      <button id="open-dialog" class="open-dialog">View Details</button>
      <dialog id="dialog-details">
        <div id="modal-box" class=modal-box>
          <h1 class="modal-head" id="modal-head">Details</h1>
          <section id="modal-head" class="modal-section">
            <h2>${product.Brand.Name}</h2>
            <h3>${product.NameWithoutBrand}</h3>
            <p>Initial Price: $${product.suggestedRetailPrice}</p>
            <p>Final Price: $${product.FinalPrice}</p>
            <p>Discounted: $${discountValue}</p>
            <p>Description: ${product.DescriptionHtmlSimple}</p>
          </section>
        </div>
        <button id="close-dialog" class="close-dialog" type="button"></button>
      </dialog>
    </li>
    `;
  } else {
    return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.Name}">
          <h2>${product.Brand.Name}</h2>
          <h3>${product.NameWithoutBrand}</h3>
          <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="open-dialog">View Details</button>
      <dialog id="dialog-details">
        <div id="modal-box" class=modal-box>
          <h1 class="modal-head" id="modal-head">Details</h1>
          <section id="modal-head" class="modal-section">
            <h2>${product.Brand.Name}</h2>
            <h3>${product.NameWithoutBrand}</h3>
            <p>Final Price: $${product.FinalPrice}</p>
            <p>Description: ${product.DescriptionHtmlSimple}</p>
          </section>
        </div>
        <button id="close-dialog" class="close-dialog" type="button"></button>
      </dialog>
    </li>
    `;
  }
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
      true,
    );
  }
}

export function displayDialog(productCards) {
  productCards.forEach((productCard) => {
    productCard
      .children("#open-dialog")
      .target.addEventListener("click", (e) => {
        //this.document.querySelector("#dialog-details").classList.toggle("show");
        e.classList.toggle("show");
      });
  });
}
