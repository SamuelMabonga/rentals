import { timeStamp } from "console";
import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import Bills from "./bills";

const PaymentsShema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: Tenant,
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
