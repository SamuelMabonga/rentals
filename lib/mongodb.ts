import mongoose from "mongoose";

const { NEXT_PUBLIC_MONGODB_SRV } = process.env;

if (!NEXT_PUBLIC_MONGODB_SRV) {
  throw new Error("Invalid environment variable: MONGODB_SRV");
}

export async function connectToMongoDB() {
  try {
    const { connection } = await mongoose.connect(NEXT_PUBLIC_MONGODB_SRV);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
