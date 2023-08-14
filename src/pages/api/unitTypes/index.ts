import {
  createUnitType,
  deleteUnitType,
  fetchAllUnitTypes,
  fetchSingleUnitType,
  updateUnitType,
} from "controllers/unit_type";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // authenticateUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));
  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      fetchAllUnitTypes(req, res);
      break;
      // case "GET":
      //   fetchSingleUnitType(req, res);
      break;
    case "POST":
      createUnitType(req, res);
      break;
    case "PUT":
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
