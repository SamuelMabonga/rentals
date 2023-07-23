import { hash } from "bcryptjs";
import { transporter } from "lib/nodemailer";
import UserVerification from "models/user_verfication";
import { NextApiResponse } from "next";


export default async function billsEmail(
    tenant: any,
    createdBills: any,
    res: NextApiResponse
) {
    // email options
    const mailOptions = {
        from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
        to: tenant.user.email,
        subject: `New Bills Notification`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Bills Notification</title>
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
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 10px;
            }
            .bill-info {
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Bills Notification</h2>
            <p>Dear [Tenant Name],</p>
            <p>We would like to inform you that new bills have been generated for your tenancy. Please find the details below:</p>
        
            <h3>Rent Bill</h3>
            <ul>
              <li>Amount: [Rent Amount]</li>
              <li>Period: [Rent Start Date] - [Rent End Date]</li>
              <li>Payment Due By: [Rent Payment Due Date]</li>
            </ul>
        
            <h3>Additional Feature Bills</h3>
            <ul>
              <li>
                <div class="bill-info">
                  <div>[Feature Name]</div>
                  <div>[Feature Amount]</div>
                </div>
                <div>Period: [Feature Start Date] - [Feature End Date]</div>
                <div>Payment Due By: [Feature Payment Due Date]</div>
              </li>
              <!-- Repeat the above list item for each additional feature bill -->
            </ul>
        
            <p>Please log in to your account to view and pay the bills. If you have any questions or concerns, please contact our support team.</p>
        
            <p>Thank you for being a valued tenant!</p>
            <p>Sincerely,<br>Property Management Team</p>
          </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("EMAIL ERROR", error);
        res.json({
            success: false,
            msg: "Failed to send email",
        })
    }

}
