import { Schema, model, models } from "mongoose";
import BillingPeriods from "./billingPeriod";
import Property from "./property";
import PropertyFeatures from "./propertyFeatures";

const UnitTypeShema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    price: {
      type: Number,
    },
    billingPeriod: {
      type: Schema.Types.ObjectId,
      ref:  BillingPeriods
    },
    // units: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Unit",
    //   },
    // ],
    property: {
      type: Schema.Types.ObjectId,
      ref: Property,
    },
    defaultFeatures: [
      {
        type: Schema.Types.ObjectId,
        ref: PropertyFeatures,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UnitType = models.UnitType || model("UnitType", UnitTypeShema);

export default UnitType;
