import BillingExtensions from "models/billExtensions";
import _template from "lib/controllerBuilder";

export default _template(
  "BillingExtensions",
  BillingExtensions,
  BillingExtensions.collection.name
);
