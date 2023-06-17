import { Schema, model, models } from "mongoose";

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
      type: String,
    },
    billingPeriod: {
      type: String,
    },
    units: [
      {
        type: Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    defaultFeatures: [
      {
        type: Schema.Types.ObjectId,
        ref: "PropertyFeatures",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UnitType = models.UnitType || model("UnitType", UnitTypeShema);

export default UnitType;
