import { Schema, model, models } from "mongoose";
import Feature from "./feature";
import BillingPeriods from "@/pages/billingPeriods";
import Property from "./property";

const PropertyFeaturesSchema = new Schema({
  feature: {
    type: Schema.Types.ObjectId,
    ref: Feature,
  },
  price: {
    type: String,
  },
  billingPeriod: {
    type: Schema.Types.ObjectId,
    ref: BillingPeriods,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: Property,
  },
}, {
  timestamps: true
});

const PropertyFeatures = models.PropertyFeatures || model("PropertyFeatures", PropertyFeaturesSchema);

export default PropertyFeatures;
