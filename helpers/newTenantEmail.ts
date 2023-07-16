import { hash } from "bcryptjs";
import { transporter } from "lib/nodemailer";
import UserVerification from "models/user_verfication";
import { NextApiResponse } from "next";

// send email verification
async function newTenantEmail(
    email: string,
    res: NextApiResponse
) {
    // email options
    const mailOptions = {
        from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
        to: email,
        subject: `Verify your Email`,
        html: `<!DOCTYPE html>
        <html>
        <head>
            <title>Welcome to Our Property!</title>
            <style>
                /* Add your custom styling here */
        
                /* For example: */
                body {
                    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
                }
        
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap');
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f7f7f7;
                }
        
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
        
                .logo {
                    max-width: 150px;
                    margin: 0 auto;
                    display: block;
                }
        
                .content {
                    background-color: #ffffff;
                    padding: 20px;
                }
        
                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 20px;
                }
        
                .footer {
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="path_to_your_logo" alt="Logo" class="logo">
                </div>
                <div class="content">
                    <h2>Welcome to Our Property!</h2>
                    <p>Dear [Tenant's Name],</p>
                    <p>We are delighted to inform you that your booking has been accepted. We look forward to having you as our tenant.</p>
                    <p>To confirm your booking, please log in to your account and pay your first bills as outlined below:</p>
                    <ul>
                        <li>Amount: [Amount]</li>
                        <li>Due Date: [Due Date]</li>
                    </ul>
                    <p>Once your payment is confirmed, your booking will be officially confirmed.</p>
                    <p>Thank you for choosing our property. If you have any questions or need assistance, please feel free to contact our team.</p>
                    <a href="https://yourpropertywebsite.com/login" class="button">Login to Your Account</a>
                </div>
                <div class="footer">
                    <p>Best regards,</p>
                    <p>Your Property Management Team</p>
                </div>
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
export default newTenantEmail;
