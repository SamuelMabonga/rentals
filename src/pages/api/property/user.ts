import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import authenticateUser from "helpers/authenticate_user";
import {
  fetchSingleProperty,
  searchProperty,
} from "controllers/property/public";
import { fetchPropertiesByRoles } from "controllers/property/admin";
import {
  createProperty,
  deleteProperty,
  updateProperty,
} from "controllers/property/owner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);
  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV ||
          "mongodb://localhost:27017/test_db"
      )
      .then(() => {
        // USER
        const { _id: user, role } = decodedToken.user;

        console.log("DECODED TOKEN", decodedToken.userRoles);

        const { method } = req;
        switch (method) {
          case "GET":
            if (id) {
              fetchSingleProperty(req, res);
            } else if (searchQuery) {
              searchProperty(req, res, searchQuery);
            } else {
              fetchPropertiesByRoles(req, res, user);
            }
            break;
          case "POST":
            createProperty(req, res);
            break;
          case "PUT":
            updateProperty(req, res);
            break;
          case "DELETE":
            deleteProperty(req, res);
            break;
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
