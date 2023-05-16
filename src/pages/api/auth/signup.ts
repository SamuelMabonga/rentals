import { hash } from "bcryptjs";
import { connectToMongoDB } from "lib/mongodb";
import User from "models/user";
import UserVerification from "models/user_verfication";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "types";
import { idText } from "typescript";
// import {v4:uuidv4} from "uuid";
import nodemailer from "nodemailer";

// send email verification
function sendEmailVerification(
  _id: string,
  email: string,
  res: NextApiResponse
) {
  // url for sending the email
  const currenturl = `http://localhost:3000/`;

  // const uniqueString = uuidv4() + _id
  const uniqueString = 1245 + _id;

  // nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXNEXT_PUBLIC_AUTH_EMAIL,
      pass: process.env.NEXT_PUBLIC_AUTH_PASSWORD,
    },
  });

  //testing success
  transporter.verify((error: any, success: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log("ready for messages");
      console.log(success);
    }
  });
  // email options
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    to: email,
    subject: `Verify your Email`,
    html: `<p>Verfiy your email address to complete the sugnup and login to your email.</p><p>This link expires in <b>6 hours</b></p><p>Press <a href=${
      currenturl + `user/verify` + _id + `/` + uniqueString
    }>here</a> to proceed</p>`,
  };

  // hash the unique string
  const saltRounds = 10;
  hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      //set the values in user verification collection
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        created_at: Date.now(),
        expires_at: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // email sent and verification record saved
              res.json({
                success: true,
                msg: "verification is pending",
              });
            })
            .catch((error: any) => {
              console.log(error);
              res.json({
                success: false,
                msg: "Verification email failed",
              });
            });
        })
        .catch((error: any) => {
          console.log(error);
          res.json({
            success: false,
            msg: "Couldnt save verification email data",
          });
        });
    })
    .catch(() => {
      res.json({
        success: false,
        msg: "An error occured while hashing email data",
      });
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectToMongoDB().catch((err) => res.json(err));

  if (req.method === "POST") {
    if (!req.body)
      return res.status(400).json({ error: "User Data is missing" });

    const {
      first_name,
      email,
      password,
      last_name,
      phone_number,
      national_id,
    } = req.body;

    console.log(email)
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
        last_name,
        email,
        national_id,
        phone_number,
        password: hashedPassword,
        verified: false,
      })
        .then((data: IUser) => {
          //send verification email
          sendEmailVerification(data._id, data._id, res);

          const user = {
            _id: data._id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            national_id: data.national_id,
            phone_number: data.phone_number,
            verified: data.verified,
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
