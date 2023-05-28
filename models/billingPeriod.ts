import { Schema, model, models } from "mongoose";

const BillingPeriodsSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
}, {
    timestamps: true
});

const BillingPeriods = models.BillingPeriods || model("BillingPeriods", BillingPeriodsSchema);

export default BillingPeriods;