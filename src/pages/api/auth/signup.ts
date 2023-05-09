import { hash } from "bcryptjs";
import { connectToMongoDB } from "lib/mongodb";
import User from "models/user";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectToMongoDB().catch((err) => res.json(err));

  if (req.method === "POST") {
    if (!req.body)
      return res.status(400).json({ error: "User Data is missing" });

    const { first_name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "User Already exists" });
    } else {
      if (password.length < 6)
        return res
          .status(409)
          .json({ error: "Password should be 6 characters long" });

      const hashedPassword = await hash(password, 12);

      User.create({
        first_name,
        email,
        password: hashedPassword,
      })
        .then((data: IUser) => {
          const user = {
            email: data.email,
            first_name: data.first_name,
            _id: data._id,
          };

          return res.status(201).json({
            success: true,
            user,
          });
        })
        .catch((error: unknown) => {
          if (error && error instanceof mongoose.Error.ValidationError) {
            // mongodb  returns array
            // loop to show one at at time

            for (let field in error.errors) {
              const msg = error.errors[field].message;
              return res.status(409).json({ error: msg });
            }
          }
        });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
