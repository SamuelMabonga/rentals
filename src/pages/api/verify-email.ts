import { verifyEmail } from "controllers/verify_email";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //id for fetching single User
  const {
    query: { id },
  }: any = req;

  //type of request
  const { method } = req;
  switch (method) {
    case "GET":
      id && verifyEmail(req, res);
      break;

    default:
      //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} not Allowed`);
      break;
  }
}
