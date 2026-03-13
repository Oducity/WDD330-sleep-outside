import { getLocalStorage, setLocalStorage } from "./utils.mjs";



export default class productDetails {
    constructor(productId, dataSource) {
        //Constructor to set parameters;
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document.getElementById("addToCart").addEventListener("click", this.productToCart.bind(this));
    }

    addProductToCart(product) {
        // This checks if so-cart is available in the localStorage and ste so-cart to lacalStorage.
        let cartItems = getLocalStorage("so-cart") || [];

        cartItems.push(product);

        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
};

function productDetailsTemplate(product) {
    // This manipulate the DOM and and its text node.
    document.querySelector("h2").innerText = product.Brand.Name;
    document.querySelector("h3").innerText = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById("productPrice").textContent = product.FinalPrice;
    document.getElementById("productColor").textContent = product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
};
