import { acceptBooking } from "controllers/booking";
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
    case "POST":
      // const postPermission = permissions.find((permission: any) => permission.name === "Accept booking")
      // if (!postPermission) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: "Not Authorized",
      //   });
      // }
      acceptBooking(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
