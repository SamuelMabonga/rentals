import { Schema, model, models } from "mongoose";

const BillingExtensionsSchema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
    },
    start_date: Date,
    extention_date: Date,
  },
  {
    timestamps: true,
  }
);

const BillingExtensions =
  models.BillingExtensions ||
  model("BillingExtensions", BillingExtensionsSchema);

export default BillingExtensions;
