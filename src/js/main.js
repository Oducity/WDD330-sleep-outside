import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.mjs";

loadHeaderFooter();

const alertData = new Alert("../public/json/alert.json");
alertData.getAlertData();