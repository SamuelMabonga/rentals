import { Schema, model, models } from "mongoose";
import Tenant from "./tenant";
import PropertyFeatures from "./propertyFeatures";
import Extensions from "./extensions";

const RolesSchema: any = new Schema(
  {
    name: {
      type: String,
    },
    permissions: {
        type: Array,
        default: []
    }
  },
  {
    timestamps: true,
  }
);

const Roles = models.Roles || model("Roles", RolesSchema);

export default Roles;
