import { Schema, model, models } from "mongoose";
import User from "./user";
import Property from "./property";
import Roles from "./roles";

const UserRolesSchema: any = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: Property
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
