import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import jwt from "jsonwebtoken";
import authenticateUser from "helpers/authenticate_user";
import { searchUsers } from "controllers/searchUsers";
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const {
      query: { id, userId },
    }: any = req;
  
    const decodedToken = authenticateUser(req, res);
  
    connectToMongoDB().catch((err) => res.json(err));
  
    console.log("DECODED TOKEN", decodedToken)
  
  
    //type of request
    // console.log(req)
  
    // USER
    const { _id: userFetching } = decodedToken.user;
  
    const { method } = req;
    switch (method) {
      case "GET":
        searchUsers(req, res)
        break;

      default:
        //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
        res.status(405).end(`Method ${method} not Allowed`);
        break;
    }
  }
  