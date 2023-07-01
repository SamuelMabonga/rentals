import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function authenticateUser(req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers.authorization?.replace("Bearer ", "");

  // HANDLE NO TOKEN
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "You do not have access, please login first",
    });
  }
  
  const decodedToken: any = jwt.verify(token, "your-secret-key");

    // HANDLE PERMISSION CONTROL HERE
    // if (!token) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You do not have access, please login first",
    //   });
    // }

  return decodedToken;
}
