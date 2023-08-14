import mongoose from "mongoose";
import {
  createUnit,
  deleteUnit,
  fetchAllPropertyUnits,
  fetchAllUnits,
  fetchSingleUnit,
  searchPropertyUnits,
  updateUnit,
} from "controllers/unit";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // const {
  //   query: { id, searchQuery },
  // }: any = req;

  // const decodedToken = authenticateUser(req, res);

  // if (!decodedToken?.user?._id) {
  //   return res.status(401).json({
  //     success: false,
  //     msg: "Not Authorized",
  //   });
  // }

  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV ||
        "mongodb://localhost:27017/test_db"
      )
      .then(() => {

        //type of request
        const { method } = req;

        // Property ID
        const property = req.body.property || req.query.id

        // Reject if no property provided
        if (!property) {
          return res.status(400).json({
            success: false,
            msg: "No property provided",
          });
        }

        // Get permissions
        // const userRoles = decodedToken.userRoles
        // const userPropertyRoles = userRoles?.find((role: any) => role.property === property)
        // const permissions = userPropertyRoles?.role?.permissions

        switch (method) {
          case "GET":
            // const getPermission = permissions?.find((permission: any) => permission.name === "View unit")
            // if (!getPermission) {
            //   return res.status(401).json({
            //     success: false,
            //     msg: "Not Authorized",
            //   });
            // }
            if (req.query.searchQuery) {
              return searchPropertyUnits(req, res, req.query.searchQuery);
            }
            fetchAllPropertyUnits(req, res);
            // fetchAllUnits(req, res)
            break;
            // case "GET":
            //   fetchSingleUnit(req, res);
            break;
          case "POST":
            // const postPermission = permissions?.find((permission: any) => permission.name === "Create unit")
            // if (!postPermission) {
            //   return res.status(401).json({
            //     success: false,
            //     msg: "Not Authorized",
            //   });
            // }
            createUnit(req, res);
            break;
          case "PUT":
            // const putPermission = permissions?.find((permission: any) => permission.name === "Edit unit")
            // if (!putPermission) {
            //   return res.status(401).json({
            //     success: false,
            //     msg: "Not Authorized",
            //   });
            // }
            updateUnit(req, res);
            break;
          case "DELETE":
            // const deletePermission = permissions?.find((permission: any) => permission.name === "Delete unit")
            // if (!deletePermission) {
            //   return res.status(401).json({
            //     success: false,
            //     msg: "Not Authorized",
            //   });
            // }
            deleteUnit(req, res);
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
