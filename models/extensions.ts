import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import Bills from "./bills";

const ExtensionsShema = new Schema(
    {
        type: {
            type: String,
            default: "TENANCY",
            enum: ["TENANCY", "RENT"],
        },
        bill: {
            type: Schema.Types.ObjectId,
            ref: Bills,
            default: null,
        },
        status: {
            type: String,
            default: "PENDING",
            enum: ["ACCEPTED", "PENDING", "REJECTED"],
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: Tenant,
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

const Extensions = models.Extensions || model("Extensions", ExtensionsShema);

export default Extensions;
