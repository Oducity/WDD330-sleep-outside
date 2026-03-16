import { renderListWithTemplate } from "./utils.mjs";
import { getDiscount } from "./getDiscount.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
        <a href="product_page/?product=${product.Id}">
            <img src="${product.Image}" alt="image of ${product.Name}">
            <h2>${product.Brand.Name}</h2>
            <h3>${product.Name}</h3>
            <p clas="product-card_price">${product.FinalPrice}</p>
            <p>Disc: 3%</p>
        </a>
    </li>`;
};


export default class productList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}