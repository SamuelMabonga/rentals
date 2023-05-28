import { Schema, model, models } from "mongoose";

const FeatureShema = new Schema({
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
  created_at: {
    type: Date,
  }
});

const Feature = models.Feature || model("Feature", FeatureShema);

export default Feature;
