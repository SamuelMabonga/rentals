import { Schema, model, models } from "mongoose";
import User from "./user";
import Unit from "./unit";
import PropertyFeatures from "./propertyFeatures";
import BillingPeriods from "./billingPeriod";
import Property from "./property";

const TenantSchema: any = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: Unit
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  additionalFeatures: [
    {
      type: Schema.Types.ObjectId,
      ref: PropertyFeatures
    }
  ],
  customRent: {
    type: Number
  },
  customBillingPeriod: {
    type: Schema.Types.ObjectId,
    ref: BillingPeriods
  },
  nextRentBilling: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    default: "PENDING",
    enum: [
      "PENDING",
      "ACTIVE",
      "INACTIVE"
    ]
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: Property
  }
},{
  timestamps: true
});

const Tenant = models.Tenant || model("Tenant", TenantSchema);

export default Tenant;
