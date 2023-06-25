import mongoose from "mongoose";
import {
  createPayments,
  deletePayment,
  fetchAllPayments,
  fetchSinglePayment,
  flutterwaveWebhook,
  updatePayments,
} from "controllers/payments";
import { NextApiRequest, NextApiResponse } from "next";
import authenticateUser from "helpers/authenticate_user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV || "mongodb://localhost:27017/test_db"
      )
      .then(() => {

        const { method } = req;

        if (!method || method !== "POST") {
          return res.status(405).end(`Method ${method} not Allowed`);
        }

        flutterwaveWebhook(req, res);

        res.status(200).end()
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Database connection failed",
      data: error,
    });
  }
}
