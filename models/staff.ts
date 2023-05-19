import { Schema, model, models } from "mongoose";

const StaffShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  role: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  }
});

const Staff = models.Staff || model("Staff", StaffShema);

export default Staff;
