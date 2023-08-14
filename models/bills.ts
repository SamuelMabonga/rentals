import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import PropertyFeatures from "./propertyFeatures";
import Extensions from "./extensions";
import Property from "./property";

const BillsShema: any = new Schema(
  {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: Tenant,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: Property,
    },
    type: {
      type: String, // Rent / Feature
      default: "RENT",
      enum: ["RENT", "FEATURE"],
    },
    status: {
      type: String, // Rent / Feature
      default: "PENDING",
      enum: ["PAID", "PENDING", "OVERDUE"],
    },
    propertyFeature: {
      type: Schema.Types.ObjectId,
      ref: PropertyFeatures,
    },
    amount: {
      type: Number,
    },
    pay_by: {
      type: Date,
    },
    amountPaid: {
      type: Number,
    },
    extended: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Bills = models.Bills || model("Bills", BillsShema);

export default Bills;
