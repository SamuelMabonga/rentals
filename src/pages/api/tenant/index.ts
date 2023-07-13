import {
  createTenant,
  deleteTenant,
  fetchAllTenants,
  fetchSingleTenant,
  updateTenant,
} from "controllers/tenant";
import authenticateUser from "helpers/authenticate_user";
import authUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  authUser(req, res);


  const {
    query: { id: query, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);
  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_SRV || "mongodb://localhost:27017/test_db").then(() => {
      // USER
      const { _id, role } = decodedToken.user;

      const { method } = req;
      switch (method) {
        case "GET":
    
          // if (query) {
          //   return fetchSingleTenant(req, res);
          // }
          fetchAllTenants(req, res);
    
          break;
          // case "GET":
          //   fetchSingleTenant(req, res);
          break;
        case "POST":
          createTenant(req, res);
          break;
        case "PUT":
          updateTenant(req, res);
          break;
        case "DELETE":
          deleteTenant(req, res);
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
