import { Schema, model, models } from "mongoose";
import User from "./user";
import Property from "./property";
import Roles from "./roles";
import Tenant from "./tenant";

const UserRolesSchema: any = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      index: {
        "name": "text",
        "email": "text",
      }
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: Property
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: Tenant
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: Roles
    }
  },
  {
    timestamps: true,
  }
);

const UserRoles = models.UserRoles|| model("UserRoles", UserRolesSchema);

export default UserRoles;
