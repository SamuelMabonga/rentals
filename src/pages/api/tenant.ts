import {
  createTenant,
  deleteTenant,
  fetchAllTenants,
  fetchSingleTenant,
  updateTenant,
} from "controllers/tenant";
import authUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  authUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));
  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      fetchAllTenants(req, res);
      break;
      // case "GET":
      //   fetchSingleTenant(req, res);
      break;
    case "POST":
      createTenant(req, res);
      break;
    case "PUT":
      updateTenant(req, res);
      break;
    case "DELETE":
      deleteTenant(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
