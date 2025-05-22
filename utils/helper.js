import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const randString = () => {
  const len = 6;
  let randStr = "";
  for (let i = 0; i < len; i++) {
    const char = Math.floor(Math.random() * 10 + 1);
    randStr += char;
  }
  return randStr;
};
export const sendEmail = (email, uniqueString) => {
  let Transpot = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "zajjajdevelopment@gmail.com",
      pass: process.env.PASS,
    },
  });
  let mailOptions;
  let sender = "Zajjaj Financial App";
  mailOptions = {
    from: sender,
    to: email,
    subject: "Email Confirmation",
    html: `
   <html>
  <head></head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
    <table style="width: 100%; border-spacing: 0; padding: 0; background-color: #f4f7fa; padding-top: 40px; padding-bottom: 40px;">
      <tr>
        <td align="center">
          <div
            style="
              width: 600px;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              margin: 0 auto;
            "
          >
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2c3e50; font-size: 32px; margin: 0;">Email Verification</h1>
            </div>
            <div style="text-align: center; padding: 20px;">
              <p>Hi there,</p>
              <p>Welcome! We’re excited to have you as a part of our amazing community. To verify your email, please use the One-Time Password (OTP) below:</p>
              <div
                style="
                  font-size: 30px;
                  font-weight: bold;
                  color: #fff;
                  background-color: #16a085;
                  padding: 20px 30px;
                  border-radius: 5px;
                  margin: 20px 0;
                  display: inline-block;
                "
              >
                ${uniqueString}
              </div>
              <p>This OTP is valid for the next 15 minutes. If you didn’t request this, please ignore this email.</p>
              <a
                href="#"
                style="
                  display: inline-block;
                  background-color: #16a085;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 5px;
                  margin-top: 20px;
                "
                onmouseover="this.style.backgroundColor='#1abc9c';"
                onmouseout="this.style.backgroundColor='#16a085';"
              >
                Verify Your Email
              </a>
            </div>
            <div style="text-align: center; font-size: 12px; color: #7f8c8d; margin-top: 40px;">
              <p>
                Need help? <a href="#" style="color: #16a085; text-decoration: none;">Contact support</a>
              </p>
              <p>&copy; 2025 Your Company Name. All rights reserved.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
  Transpot.sendMail(mailOptions, function (error, res) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message Sent");
    }
  });
};
