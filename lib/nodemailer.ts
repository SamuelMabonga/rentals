import nodemailer from "nodemailer";

const { NEXT_PUBLIC_AUTH_EMAIL, NEXT_PUBLIC_EMAIL_PASS } = process.env;

const email = NEXT_PUBLIC_AUTH_EMAIL;
const pass = NEXT_PUBLIC_EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});
