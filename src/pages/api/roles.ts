import {
    createFeature,
    deleteFeature,
    fetchAllFeatures,
    fetchSingleFeature,
    updateFeature,
  } from "controllers/feature";
import { createRole, fetchAllRoles, updateRole } from "controllers/roles";
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
        fetchAllRoles(req, res);
        break;
        // case "GET":
        //   fetchSingleFeature(req, res);
        break;
      case "POST":
        createRole(req, res);
        break;
      case "PUT":
        updateRole(req, res);
        break;
      case "DELETE":
        deleteFeature(req, res);
        break;
      default:
        //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
        res.status(405).end(`Method ${method} not Allowed`);
        break;
    }
  }
  