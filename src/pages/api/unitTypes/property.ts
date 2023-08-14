import {
  createUnitType,
  deleteUnitType,
  fetchAllUnitTypes,
  fetchPropertyUnitTypes,
  fetchSingleUnitType,
  fetchUnitTypesByUnit,
  updateUnitType,
} from "controllers/unit_type";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const decodedToken = authenticateUser(req, res);

  // if (!decodedToken?.user?._id) {
  //   return res.status(401).json({
  //     success: false,
  //     msg: "Not Authorized",
  //   });
  // }

  connectToMongoDB().catch((err) => res.json(err));

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
      // const getPermission = permissions?.find((permission: any) => permission.name === "View unit type")
      // if (!getPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      fetchPropertyUnitTypes(req, res);
      break;
    // case "GET":
    //   fetchSingleUnitType(req, res);
    // break;
    case "POST":
      // const postPermission = permissions?.find((permission: any) => permission.name === "Create unit type")
      // if (!postPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      createUnitType(req, res);
      break;
    case "PUT":
      // const putPermission = permissions?.find((permission: any) => permission.name === "Edit unit type")
      // if (!putPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      updateUnitType(req, res);
      break;
    case "DELETE":
      deleteUnitType(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
