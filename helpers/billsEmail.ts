import { hash } from "bcryptjs";
import { transporter } from "lib/nodemailer";
import UserVerification from "models/user_verfication";
import { NextApiResponse } from "next";

export default async function billsEmail(
  tenant: any,
  createdBills: any,
  res: NextApiResponse
) {
  const {
    user: { first_name, last_name },
  } = tenant;
  // Loop through the array of createdBills and generate HTML content for each bill
  const additionalFeatureBills = createdBills.filter(
    (bill: any) => bill.type === "additional_feature"
  );

  const rentBillHTML = `
    <h3>Rent Bill</h3>
    <ul>
      <li>Amount: ${createdBills[0].amount}</li>
      <li>Period: ${createdBills[0].startDate} - ${createdBills[0].endDate}</li>
      <li>Payment Due By: ${createdBills[0].pay_by}</li>
    </ul>
  `;

  let additionalFeatureBillsHTML = "";
  additionalFeatureBills.forEach((bill: any) => {
    additionalFeatureBillsHTML += `
      <h3>Additional Feature Bill</h3>
      <ul>
        <li>
          <div class="bill-info">
            <div>${bill.propertyFeature.feature.name}</div>
            <div>${bill.amount}</div>
          </div>
          <div>Period: ${bill.startDate} - ${bill.endDate}</div>
          <div>Payment Due By: ${bill.pay_by}</div>
        </li>
      </ul>
    `;
  });

  const allBillsHTML = rentBillHTML + additionalFeatureBillsHTML;

  // Modify the HTML content of the email to include all the bills
  const mailOptions = {
    // ... (previous code remains unchanged)
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <!-- CSS styles and title remain unchanged -->
          <!-- ... -->
        </head>
        <body>
          <div class="container">
            <h2>New Bills Notification</h2>
            <p>Dear ${first_name} ${last_name},</p>
            <p>We would like to inform you that new bills have been generated for your tenancy. Please find the details below:</p>
        
            <!-- Insert all the bills here -->
            ${allBillsHTML}
        
            <p>Please log in to your account to view and pay the bills. If you have any questions or concerns, please contact our support team.</p>
        
            <p>Thank you for being a valued tenant!</p>
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
