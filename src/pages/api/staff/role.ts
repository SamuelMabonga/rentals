import {
  createStaff,
  deleteStaff,
  fetchAllStaffs,
  fetchAllStaffsByRoles,
  fetchSingleStaff,
  searchStaff,
  updateStaff,
} from "controllers/staff";
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

  connectToMongoDB().catch((err) => res.json(err));

  // USER
  const { _id, role } = decodedToken.user;

  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      if (id) {
        fetchSingleStaff(req, res);
      } else if (searchQuery) {
        searchStaff(req, res, searchQuery);
      } else {
        fetchAllStaffsByRoles(req, res);
      }
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
