import { Schema, model, models } from "mongoose";

const UnitShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
    unique: true
  },
  unitType: {
    type: Schema.Types.ObjectId,
    ref: 'UnitType',
  },
  status: {
    type: String,
  },
}, {
  timestamps: true
});

const Unit = models.Unit || model("Unit", UnitShema);

export default Unit;
