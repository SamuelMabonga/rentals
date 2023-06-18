import _template from "lib/controllerBuilder";
import TenancyModifications from "models/tenancyModification";

export default _template(
  "TenancyModifications",
  TenancyModifications,
  TenancyModifications.collection.name
);
