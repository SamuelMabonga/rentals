import { Schema, model, models } from "mongoose";

const TenancyModificationsSchema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
    },
    type: {
      type: String,
      enum: ["RENEW", "TERMINATE"],
    },
    start_date: Date,
    end_date: Date,
  },
  {
    timestamps: true,
  }
);

const TenancyModifications =
  models.TenancyModifications ||
  model("TenancyModifications", TenancyModificationsSchema);

export default TenancyModifications;
