import {
  createStaffRole,
  deleteStaffRole,
  fetchAllStaffRoles,
  updateStaffRole,
} from "controllers/staffRoles";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  authenticateUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));
  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      fetchAllStaffRoles(req, res);
      break;
      // case "GET":
      //   fetchSingleFeature(req, res);
    case "POST":
      createStaffRole(req, res);
      break;
    case "PUT":
      updateStaffRole(req, res);
      break;
    case "DELETE":
      deleteStaffRole(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
