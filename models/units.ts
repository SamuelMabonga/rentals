import { Schema, model, models } from "mongoose";

const UnitsShema = new Schema({
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

  created_at: {
    type: Date,
  },
  expires_at: {
    type: Date,
  },
});

const Units = models.Units || model("Units", UnitsShema);

export default Units;
