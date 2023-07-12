import BUIDING_TYPES from "constants";
import { Schema, model, models } from "mongoose";
import User from "./user";

const propertySchema: any = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2, // Example validation rule: minimum length of 2 characters
      maxlength: 100, // Example validation rule: maximum length of 100 characters
    },
    desription: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE"
    },
    cover_photo: {
      type: String,
      validate: {
        validator: function (value: any) {
          // Example custom validation: check if the URL is valid
          return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value);
        },
        message: "Invalid cover photo URL",
      },
    },
    profile_photo: {
      type: String,
      validate: {
        validator: function (value: any) {
          // Example custom validation: check if the URL is valid
          return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value);
        },
        message: "Invalid profile photo URL",
      },
    },
    details: {
      type: String,
    },
    price: {
      type: String,
    },
    gallery: [{
      type: String,
      validate: {
        validator: function (value: any) {
          // Example custom validation: check if the URL is valid
          return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value);
        },
        message: "Invalid gallery photo URL",
      },
    }],
    building_type: {
      type: String,
      enum: BUIDING_TYPES,
    },
    number_of_units: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({
  name: "text",
});

const Property = models.Property || model("Property", propertySchema);

export default Property;
