import { Schema, model, models } from "mongoose";

const StaffSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "StaffRoles",
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
});

//indexed fields for searching
StaffSchema.index({
  name: "text",
});

const Staff = models.Staff || model("Staff", StaffSchema);

export default Staff;
