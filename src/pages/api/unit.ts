import {
    createUnit,
    deleteUnit,
    fetchAllUnits,
    fetchSingleUnit,
    updateUnit,
  } from "controllers/unit";
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
        fetchAllUnits(req, res);
        break;
        // case "GET":
        //   fetchSingleUnit(req, res);
        break;
      case "POST":
        createUnit(req, res);
        break;
      case "PUT":
        updateUnit(req, res);
        break;
      case "DELETE":
        deleteUnit(req, res);
        break;
      default:
        //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
        res.status(405).end(`Method ${method} not Allowed`);
        break;
    }
  }
  