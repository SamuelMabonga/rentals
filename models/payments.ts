import { timeStamp } from "console";
import { Schema, model, models } from "mongoose";

const PaymentsShema = new Schema(
  {
    bills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bills",
      },
    ],
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payments = models.Payments || model("Payments", PaymentsShema);

export default Payments;
