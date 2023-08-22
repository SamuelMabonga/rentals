import {
  deletebill,
  fetchAllTenantBills,
  searchBill,
  updatebill,
} from "controllers/bills";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id, searchQuery },
  }: any = req;

  try {
    await mongoose
      .connect(
        process.env.NEXT_PUBLIC_MONGODB_SRV ||
        "mongodb://localhost:27017/test_db"
      )
      .then(() => {
        // USER
        // const { _id: userId, role } = decodedToken.user;

        const { method } = req;
        switch (method) {
          case "GET":
            //   if (id) {
            //     fetchSinglebill(req, res);
            //   } else 
            if (searchQuery) {
              return searchBill(req, res);
            }
            fetchAllTenantBills(req, res, "");
            break;
          // case "POST":
          //   createBill(req, res);
          //   break;
          case "PUT":
            updatebill(req, res);
            break;
          case "DELETE":
            deletebill(req, res);
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
