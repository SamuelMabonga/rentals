import {
  createStaff,
  deleteStaff,
  fetchAllStaffs,
  fetchSingleStaff,
  updateStaff,
} from "controllers/staff";
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
      fetchAllStaffs(req, res);
      break;
      // case "GET":
      //   fetchSingleStaff(req, res);
      break;
    case "POST":
      createStaff(req, res);
      break;
    case "PUT":
      updateStaff(req, res);
      break;
    case "DELETE":
      deleteStaff(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
