import {
  createTenant,
  deleteTenant,
  fetchAllTenants,
  fetchAllUserTenancies,
  fetchSingleTenant,
  updateTenant,
} from "controllers/tenant";
import authenticateUser from "helpers/authenticate_user";
import authUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  authUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));

  const decodedToken = authenticateUser(req, res);
  // USER
  const { _id: userId, role } = decodedToken.user;
  const {
    query: { id: query, searchQuery },
  }: any = req;

  //type of request
  const { method } = req;

  switch (method) {
    case "GET":
      // if (userTenantRoles && userTenantRoles.length > 0) { 
        
      //  }
      if (query) {
        return fetchSingleTenant(req, res, userId);
      }
      fetchAllUserTenancies(req, res, userId);
      break;
      // case "GET":
      //   fetchSingleTenant(req, res);
      // break;
    // case "POST":
    //   createTenant(req, res);
    //   break;
    // case "PUT":
    //   updateTenant(req, res);
    //   break;
    // case "DELETE":
    //   deleteTenant(req, res);
    //   break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
