import {
  createProperty,
  fetchAllProperties,
  fetchSingleProperty,
} from "controllers/property";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectToMongoDB().catch((err) => res.json(err));

  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      fetchAllProperties(req, res);
      break;
    // case "GET":
    //   fetchSingleProperty(req, res);
      break;
    case "POST":
      createProperty(req, res);
      break;
    case "PUT":
      res.status(200).json({ method, name: "PUT Request" });
      break;
    case "DELETE":
      res.status(200).json({ method, name: "DELETE Request" });
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
