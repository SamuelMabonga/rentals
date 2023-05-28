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
  billingPeriod: {
    type: String,
  },
  units: {
    type: Array,
  },
  defaultFeatures: [{
      type: Schema.Types.ObjectId,
      ref: 'Feature',
  }]
}, {
  timestamps: true
});

const UnitType = models.UnitType || model("UnitType", UnitTypeShema);

export default UnitType;
