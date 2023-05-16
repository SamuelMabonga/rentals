import nodemailer from "nodemailer";

const email = "mukisabahati@gmail.com"; //securesally@gmail.com
const pass = "qakeozfyajdnuqdw";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.NEXNEXT_PUBLIC_AUTH_EMAIL,
    // pass: process.env.NEXT_PUBLIC_AUTH_PASSWORD,
    user: email,
    pass,
  },
});
