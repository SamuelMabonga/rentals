import BUIDING_TYPES from "constants";
import { Schema, model, models } from "mongoose";

const propertySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cover_photo: {
    type: String,
  },
  profile_photo: {
    type: String,
  },
  details: {
    type: String,
  },
  price: {
    type: String,
  },
  gallery: {
    type: Array,
  },
  building_type: {
    type: String,
    // enum:  // BUIDING_TYPES
  },
  number_of_units: {
    type: String,
  },
}, {
  timestamps: true
});

const Property = models.Property || model("Property", propertySchema);

export default Property;
