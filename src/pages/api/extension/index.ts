import mongoose from "mongoose";
import {
  createUnit,
  deleteUnit,
  fetchAllUnits,
  fetchSingleUnit,
  updateUnit,
} from "controllers/unit";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {
    query: { id, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_SRV || "mongodb://localhost:27017/test_db").then(() => {
      // USER
      const { _id, role } = decodedToken.user;

      const { method } = req;
      switch (method) {
        case "GET":
          if (id) {
            return fetchSingleUnit(req, res)
          }
          fetchAllUnits(req, res);
          break;
            //  case "GET":
            //  fetchSingleUnit(req, res);
            //  break;
        case "POST":
          createUnit(req, res);
          break;
        case "PUT":
          updateUnit(req, res);
          break;
        case "DELETE":
          deleteUnit(req, res);
          break;
        default:
          //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
          res.status(405).end(`Method ${method} not Allowed`);
          break;
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Database connection failed",
      data: error,
    });
  }
}
