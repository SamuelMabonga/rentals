import { hash } from "bcryptjs";
import { transporter } from "lib/nodemailer";
import UserVerification from "models/user_verfication";
import { NextApiResponse } from "next";

// send email verification
function sendEmailVerification(
  _id: string,
  email: string,
  res: NextApiResponse
) {
  //endpoint for verifying emails
  const url = `http://localhost:3000/api/verify-email?id=${_id}`;

  // const uniqueString = uuidv4() + _id
  const uniqueString = 1245 + _id;

  // email options
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    to: email,
    subject: `Welcome to Rental It! Verify Your Email`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0066cc;">Hello there,</h2>
        <p>Welcome to <strong style="color: #0066cc;">Rental It</strong>! We're thrilled to have you on board.</p>
        <p style="margin-bottom: 30px;">To get started, please verify your email address by clicking the link below:</p>
        <a href=${url} style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px;">Verify My Email</a>
        <p style="margin-top: 30px;">This link will expire in <strong>6 hours</strong>, so make sure to verify your email as soon as possible.</p>
        <p style="margin-top: 20px;">If you didn't sign up for <strong style="color: #0066cc;">Rental It</strong>, you can safely ignore this email.</p>
        <p style="margin-top: 40px;">Happy renting and exploring with <strong style="color: #0066cc;">Rental It</strong>!</p>
        <p>Best regards,<br>The Rental It Team</p>
      </div>
    </div>
  `,
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
        //expire in 6 hours
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

export default sendEmailVerification;
