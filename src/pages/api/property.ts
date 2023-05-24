import {
  createProperty,
  deleteProperty,
  fetchAllProperties,
  fetchSingleProperty,
  updateProperty,
} from "controllers/property";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query: {id} }: any = req;
  const token: any = req.headers.authorization?.replace('Bearer ', '');

  const decodedToken = jwt.verify(token, 'your-secret-key');

  // const token = await getToken({ req })

  const session = await getSession({ req });

  // console.log("Token --", token)
  // console.log("Token decoded --", decodedToken)

  // HANDLE PERMISSION CONTROL HERE
  if (!token) {
    res.status(403).json({
      success: false,
      message: "You do not have access"
    })
  }

  
  connectToMongoDB().catch((err) => res.json(err));

  //type of request
  // console.log(req)

  console.log("Slug", id) 

  const { method } = req;
  switch (method) {
    case "GET":
      if (!id) {
        return fetchAllProperties(req, res);
      } else {
        fetchSingleProperty(req, res)
      }
      break;
      // case "GET":
      //   fetchSingleProperty(req, res);
      // break;
    case "POST":
      createProperty(req, res);
      break;
    case "PUT":
      updateProperty(req, res);
      break;
    case "DELETE":
      deleteProperty(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
