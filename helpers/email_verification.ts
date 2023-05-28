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
  // url for sending the email
//   TODO: refactor to use .env value 
  const currenturl = process.env.NEXT_PUBLIC_HOST;

  // const uniqueString = uuidv4() + _id
  const uniqueString = 1245 + _id;

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
