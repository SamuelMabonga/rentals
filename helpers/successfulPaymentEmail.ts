import { hash } from "bcryptjs";
import { transporter } from "lib/nodemailer";
import UserVerification from "models/user_verfication";
import { NextApiResponse } from "next";

export default async function successfulPaymentEmail(
  payment: any,
  createdBills: any,
  res: NextApiResponse
) {
  const {
    tenant: { user },
  } = payment;
  const paymentMethod = "Flutterwave";
  // email options
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    to: user?.email,
    subject: `Successful Payment Notification`,
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Successful</title>
          <style>
            /* CSS styles for the email template */
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
            }
            h2 {
              color: #333;
            }
            p {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Payment Successful</h2>
            <p>Dear ${user?.first_name}&nbsp;${user?.last_name}</p>
            <p>We are pleased to inform you that your payment has been successfully received and applied to your account.</p>
            <p>Payment Details:</p>
            <ul>
              <li>Payment Amount: ${payment?.amountPaid}</li>
              <li>Payment Date: ${payment?.createdAt}</li>
              <li>Payment Method: ${paymentMethod}</li>
              <li>Invoice Number: ${payment?._id}</li>
            </ul>
            <p>If you have any questions or concerns regarding your payment or your account, please don't hesitate to contact our support team.</p>
            <p>Thank you for your prompt payment and cooperation.</p>
            <p>Sincerely,<br>Property Management Team</p>
          </div>
        </body>
        </html>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("EMAIL ERROR", error);
    res.json({
      success: false,
      msg: "Failed to send email",
    });
  }
}
