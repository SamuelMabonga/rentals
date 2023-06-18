import authenticateUser from "helpers/authenticate_user";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import billExtensionsController from "controllers/billExtensions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  const decodedToken = authenticateUser(req, res);
  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV ||
          "mongodb://localhost:27017/test_db"
      )
      .then(() => {
        // USER
        const { _id, role } = decodedToken.user;

        const { method } = req;
        switch (method) {
          case "GET":
            if (id) {
              billExtensionsController.getSingleEntity(req, res);
            } else {
              billExtensionsController.getAllEntities(req, res);
            }
            break;
          case "POST":
            billExtensionsController.createEntity(req, res);
            break;
          case "PUT":
            billExtensionsController.updateEntity(req, res);
            break;
          case "DELETE":
            billExtensionsController.deleteEntity(req, res);
            break;
          default:
            //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
            res.status(405).end(`Method ${method} not Allowed`);
            break;
        }
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Database connection failed",
      data: error,
    });
  }
}