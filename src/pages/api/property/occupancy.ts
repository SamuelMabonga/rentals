import { createProperty } from "controllers/property/owner";
import {
  fetchAllProperties,
  fetchOccupancy,
  fetchSingleProperty,
  searchProperty,
} from "controllers/property/public";
import mongoose from "mongoose";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV ||
        "mongodb://localhost:27017/test_db"
      )
      .then(() => {
        const { method } = req;
        switch (method) {
          case "GET":
              return fetchOccupancy(req, res);
            break;

        //   case "POST":
        //     createProperty(req, res);
        //     break;
          default:
            //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
            res.status(405).end(`Method ${method} not Allowed`);
            break;
        }
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Database connection failed",
      data: error,
    });
  }
}
