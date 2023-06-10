import {
  createBooking,
  deleteBooking,
  fetchAllBookings,
  fetchSingleBooking,
  searchBooking,
  updateBooking,
} from "controllers/booking";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);

  connectToMongoDB().catch((err) => res.json(err));

  // USER
  const { _id, role } = decodedToken.user;

  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
       if (id) {
        fetchSingleBooking(req, res);
      } else if (searchQuery) {
        searchBooking(req, res, searchQuery);
      } else {
        fetchAllBookings(req, res);
      }
      break;
    case "POST":
      createBooking(req, res);
      break;
    case "PUT":
      updateBooking(req, res);
      break;
    case "DELETE":
      deleteBooking(req, res);
      break;
    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
