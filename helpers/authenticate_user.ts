import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function authenticateUser(req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers.authorization?.replace("Bearer ", "");

  const decodedToken: any = jwt.verify(token, "your-secret-key");
  // const token = await getToken({ req })

  // console.log("Token --", token)
  console.log("Token decoded --", decodedToken);

  // HANDLE PERMISSION CONTROL HERE
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "You do not have access, please login first",
    });
  }
  return decodedToken;
}
