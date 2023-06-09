import {
  createProperty,
  deleteProperty,
  fetchAllProperties,
  fetchSingleProperty,
  searchProperty,
  updateProperty,
  adminFetchAllProperties,
} from "controllers/property";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import jwt from "jsonwebtoken";
import authenticateUser from "helpers/authenticate_user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));

  //type of request
  // console.log(req)

  // USER
  const { _id, role } = decodedToken.user;

  const { method } = req;
  switch (method) {
    case "GET":
      if (role === "admin") return adminFetchAllProperties(req, res);
      if (id) return fetchSingleProperty(req, res, id);
      if (searchQuery) return searchProperty(req, res, searchQuery);
      fetchAllProperties(req, res, _id);
      break;
    case "POST":
      createProperty(req, res, _id);
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
