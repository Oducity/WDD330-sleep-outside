import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import alert from "./alert.mjs";

const dataSource = new ExternalServices();
const productID = getParam("product");

// Load product details and header/footer in parallel
const product = new ProductDetails(productID, dataSource);
Promise.all([
  product.init(),
  loadHeaderFooter()
]);

// Load alerts in background (not blocking product render)
const alertData = new alert("/json/alert.json");
alertData.getAlertData();
