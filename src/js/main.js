import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const alertData = new Alert("/json/alert.json");
alertData.getAlertData();

// setup product list (home page)
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

if (element) {
    const productList = new ProductList("tents", dataSource, element);
    productList.init();
}

// Warm product category data in the background to speed up category page loads.
const categoriesToPrefetch = ["backpacks", "sleeping-bags", "hammocks"];

function prefetchCategories() {
    categoriesToPrefetch.forEach((category) => {
        dataSource.getData(category).catch(() => {
            // Ignore prefetch errors; regular navigation will still attempt a live fetch.
        });
    });
}

if ("requestIdleCallback" in window) {
    window.requestIdleCallback(prefetchCategories, { timeout: 2000 });
} else {
    window.setTimeout(prefetchCategories, 800);
}
