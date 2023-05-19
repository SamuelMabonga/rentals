import { Schema, model, models } from "mongoose";

const UnitTypeShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  price: {
    type: String,
  },
  rate: {
    type: String,
  },
  units: {
    type: Array,
  },
  created_at: {
    type: Date,
  }
});

const UnitType = models.UnitType || model("UnitType", UnitTypeShema);

export default UnitType;
