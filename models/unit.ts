import { Schema, model, models } from "mongoose";
import UnitType from "./unitType";
import Property from "./property";
import Tenant from "./tenant";

const UnitSchema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
    unique: true,
  },
  unitType: {
    type: Schema.Types.ObjectId,
    ref: UnitType,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: Property,
  },
  availableAfter: {
    type: Date,
    default: null
  },
  // tenant: {
  //   type: Schema.Types.ObjectId,
  //   ref: Tenant,
  //   default: null
  // },
  status: {
    type: String,
    enum: ["AVAILABLE", "OCCUPIED"],
    default: "AVAILABLE"
  },
}, {
  timestamps: true
});

//indexed fields for searching
UnitSchema.index({
  name: "text",
  "unitType.name": "text"
});

const Unit = models.Unit || model("Unit", UnitSchema);

export default Unit;
