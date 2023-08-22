import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import Bills from "./bills";
import Property from "./property";

const PaymentsShema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: Tenant,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: Property,
    },
    bills: [
      {
        type: Schema.Types.ObjectId,
        ref: Bills,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: [
        "PENDING",
        "SUCCESSFUL",
        "FAILED"
      ]
    },
  },
  {
    timestamps: true,
  }
);

const Payments = models.Payments || model("Payments", PaymentsShema);

export default Payments;
