import { Schema, model, models } from "mongoose";

const PropertyFeaturesSchema = new Schema({
  feature: {
    type: Schema.Types.ObjectId,
    ref: 'Feature',
  },
  price: {
    type: String,
  },
  billingPeriod: {
    type: Schema.Types.ObjectId,
    ref: 'BillingPeriods',
  }
}, {
  timestamps: true
});

const PropertyFeatures = models.PropertyFeatures || model("PropertyFeatures", PropertyFeaturesSchema);

export default PropertyFeatures;
