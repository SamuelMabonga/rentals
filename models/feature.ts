import { Schema, model, models } from "mongoose";

const FeatureShema = new Schema({
  image: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
});

const Feature = models.Feature || model("Feature", FeatureShema);

export default Feature;
