import {
  createTenant,
  deleteTenant,
  fetchAllPropertyTenants,
  searchTenant,
  updateTenant,
} from "controllers/tenant";
import authenticateUser from "helpers/authenticate_user";
import authUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // authUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));

  // const decodedToken = authenticateUser(req, res);

  // if (!decodedToken?.user?._id) {
  //   return res.status(401).json({
  //     success: false,
  //     msg: "Not Authorized",
  //   });
  // }

  //type of request
  const { method } = req;

  // Property ID
  const property = req.body.property || req.query.id

  // Tenant ID
  const tenant = req.body.tenant || req.query.tenant

  const searchQuery: any = req.query.searchQuery

  // User ID
  // const user: string = decodedToken?.user?._id

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
      // const getPermission = permissions?.find((permission: any) => permission.name === "View tenants")
      // if (!getPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }


      // if (tenant) {

      //   return fetchSingleTenant(req, res);
      // }

      if (searchQuery) {
        return searchTenant(req, res, searchQuery)
      }

      fetchAllPropertyTenants(req, res);
      break;
    // case "GET":
    //   fetchSingleTenant(req, res);
    // break;
    case "POST":
      // const postPermission = permissions?.find((permission: any) => permission.name === "Create tenant")
      // if (!postPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }

      createTenant(req, res);
      break;
    case "PUT":
      // const putPermission = permissions?.find((permission: any) => permission.name === "Edit tenant")
      // if (!putPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      updateTenant(req, res);
      break;
    case "DELETE":
      // const deletePermission = permissions?.find((permission: any) => permission.name === "Delete tenant")
      // if (!deletePermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      deleteTenant(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
