import { Schema, model, models } from "mongoose";

const TenantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit"
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  additionalFeatures: [
    {
      type: Schema.Types.ObjectId,
      ref: "PropertyFeatures"
    }
  ],
  customRent: {
    type: String
  },
  customBillingPeriod: {
    type: Schema.Types.ObjectId,
    ref: "BillingPeriods"
  },
  nextRentBilling: {
    type: Date
  }
},{
  timestamps: true
});

const Tenant = models.Tenant || model("Tenant", TenantSchema);

export default Tenant;
