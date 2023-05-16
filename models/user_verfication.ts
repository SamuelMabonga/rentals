import { Schema, model, models } from "mongoose";

const UserVerificationShema = new Schema({
  userId: {
    type: String,
  },
  uniqueString: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  expires_at: {
    type: Date,
  },
});

const UserVerification =
  models.UserVerification || model("UserVerification", UserVerificationShema);

export default UserVerification;
