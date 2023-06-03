import { Schema, model, models } from "mongoose";

const UserShema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email address",
    ],
  },
  first_name: {
    type: String,
    required: [true, "first name is required"],
    minLength: [4, "first name should be atleast 4 characters long"],
    maxLength: [30, "first name should be atleast 30 characters long"],
  },
  last_name: {
    type: String,
    required: [true, "first name is required"],
    minLength: [4, "first name should be atleast 4 characters long"],
    maxLength: [30, "first name should be atleast 30 characters long"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  national_id: {
    type: String,
    required: [true, "national id is required"],
  },
  phone_number: {
    type: String,
    required: [true, "phone number is required"],
  },
  verified: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = models.User || model("User", UserShema);

export default User;
