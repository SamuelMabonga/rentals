import { Schema, model, models } from "mongoose";

const UnitShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  tenant: {
    type: String,
  },
  unit_type: {
    type: String,
  },
  unit_status: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  expires_at: {
    type: Date,
  },
});

const Unit = models.Unit || model("Unit", UnitShema);

export default Unit;
