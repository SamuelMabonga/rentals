import {
  createBooking,
  deleteBooking,
  fetchAllBookings,
  fetchAllPropertyBookings,
  fetchSingleBooking,
  searchBooking,
  updateBooking,
} from "controllers/booking";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {
    query: { id, searchQuery },
  }: any = req;

  // const decodedToken = authenticateUser(req, res);

  // console.log(decodedToken)

  // if (!decodedToken?.user?._id) {
  //   return res.status(401).json({
  //     success: false,
  //     msg: "Not Authorized",
  //   });
  // }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_SRV || "mongodb://localhost:27017/test_db").then(() => {

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
          // const getPermission = permissions?.find((permission: any) => permission.name === "View bookings")
          // if (!getPermission) {
          //   return res.status(401).json({
          //     success: false,
          //     msg: "Not Authorized",
          //   });
          // }
          // if (id) {
          //   fetchSingleBooking(req, res);
          // } else 
          if (searchQuery) {
            searchBooking(req, res, searchQuery);
          } else {
            fetchAllPropertyBookings(req, res);
          }
          break;
        case "POST":
          // const postPermission = permissions?.find((permission: any) => permission.name === "Post booking")
          // if (!postPermission) {
          //   return res.status(401).json({
          //     success: false,
          //     msg: "Not Authorized",
          //   });
          // }
          createBooking(req, res);
          break;
        case "PUT":
          // const putPermission = permissions?.find((permission: any) => permission.name === "Edit booking")
          // if (!putPermission) {
          //   return res.status(401).json({
          //     success: false,
          //     msg: "Not Authorized",
          //   });
          // }
          updateBooking(req, res);
          break;
        case "DELETE":
          // const deletePermission = permissions?.find((permission: any) => permission.name === "Delete booking")
          // if (!deletePermission) {
          //   return res.status(401).json({
          //     success: false,
          //     msg: "Not Authorized",
          //   });
          // }
          deleteBooking(req, res);
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
