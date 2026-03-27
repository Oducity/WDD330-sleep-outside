import { getParam, loadHeaderFooter} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import alert from "./alert.mjs";

const alertData = new alert("../public/json/alert.json");
const dataSource = new ExternalServices();
const productID = getParam("product");

alertData.getAlertData();
const product = new ProductDetails(productID, dataSource);
product.init();
loadHeaderFooter();
