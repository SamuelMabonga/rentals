import mongoose, { Document } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

export interface IUser extends Document {
    name: string;
    age: number;
    email: string;
    password: string;
    userType: string;
    createdAt: Date;
    updatedAt: Date;
}
let UserModel: mongoose.Model<IUser>;
try {
  // Try to get the existing model from mongoose
  UserModel = mongoose.model<IUser>('User');
} catch {
  // If the model doesn't exist, define it
  UserModel = mongoose.model<IUser>('User', userSchema);
}
export default UserModel;