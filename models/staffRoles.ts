import { Schema, model, models } from "mongoose";

const StaffRolesSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
}, {
    timestamps: true
});

const StaffRoles = models.Feature || model("StaffRoles", StaffRolesSchema);

export default StaffRoles;