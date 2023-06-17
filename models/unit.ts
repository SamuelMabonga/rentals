import { Schema, model, models } from "mongoose";

const UnitSchema = new Schema({
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
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: "Tenant",
    default: null
  },
  status: {
    type: String,
  },
}, {
  timestamps: true
});

const Unit = models.Unit || model("Unit", UnitSchema);

export default Unit;
