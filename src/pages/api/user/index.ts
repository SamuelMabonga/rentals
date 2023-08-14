import {
  deleteUser,
  fetchAllUsers,
  fetchSingleUser,
  searchUser,
  updateUser,
} from "controllers/user";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //id for fetching single User
  const {
    query: { id, searchQuery },
  }: any = req;

  // authenticateUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));
  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      if (id) {
        return fetchSingleUser(req, res);
      } else if (searchQuery) {
        return searchUser(req, res);
      } else {
        fetchAllUsers(req, res);
      }
      break;
    case "PUT":
      updateUser(req, res);
      break;
    case "DELETE":
      deleteUser(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
