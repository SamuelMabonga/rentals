import { Schema, model, models } from "mongoose";

const BillingPeriodsSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    time: {
        type: Number
    }
}, {
    timestamps: true
});

const BillingPeriods = models.BillingPeriods || model("BillingPeriods", BillingPeriodsSchema);

export default BillingPeriods;