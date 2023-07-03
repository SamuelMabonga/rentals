import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import Bills from "./bills";
import Property from "./property";

const TenancyModificationShema = new Schema(
    {
        status: {
            type: String,
            default: "PENDING",
            enum: ["ACCEPTED", "PENDING", "REJECTED"],
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: Tenant,
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: Property,
        },
        newDate: {
            type: Date,
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const TenancyModification = models.TenancyModification || model("TenancyModification", TenancyModificationShema);

export default TenancyModification;
