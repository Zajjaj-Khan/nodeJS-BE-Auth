
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
export const randString = () => {
    const len = 6;
    let randStr = '';
    for(let i = 0; i<len; i++){
        const char = Math.floor((Math.random() *10)+1);
        randStr += char
    }
    return randStr
}
export const sendEmail = (email,uniqueString)=>{
    let Transpot  = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'zajjajdevelopment@gmail.com',
            pass:process.env.PASS
        }
    });
    let mailOptions;
    let sender = "Zajjaj Financial App"
    mailOptions = {
        from: sender,
        to:email,
        subject: "Email Confirmation",
        html:`
    <html>
      <head>
        <style>
           body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fa;
    }

    table {
      width: 100%;
      border-spacing: 0;
      padding: 0;
    }

    /* Container */
    .email-container {
      width: 100%;
      background-color: #f4f7fa;
      padding: 40px 0;
    }

    /* Main content */
    .email-content {
      width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .email-header h1 {
      color: #2c3e50;
      font-size: 32px;
      margin: 0;
    }

    .email-body {
      text-align: center;
      padding: 20px;
    }

    .otp {
      font-size: 30px;
      font-weight: bold;
      color: #fff;
      background-color: #16a085;
      padding: 20px 30px;
      border-radius: 5px;
      margin: 20px 0;
      display: inline-block;
    }

    .cta-button {
      display: inline-block;
      background-color: #16a085;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
      margin-top: 20px;
    }

    .cta-button:hover {
      background-color: #1abc9c;
    }

    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #7f8c8d;
      margin-top: 40px;
    }

    .email-footer a {
      color: #16a085;
      text-decoration: none;
    }

    /* Responsive Styles */
    @media (max-width: 600px) {
      .email-content {
        padding: 20px;
      }
    }
        </style>
      </head>
      <body>
        <table class="email-container">
          <tr>
            <td>
              <div class="email-content">
                <div class="email-header">
                  <h1>Email Verification</h1>
                </div>
                <div class="email-body">
                  <p>Hi there,</p>
                  <p>Welcome! We’re excited to have you as a part of our amazing community. To verify your email, please use the One-Time Password (OTP) below:</p>
                  <div class="otp">${uniqueString}</div>
                  <p>This OTP is valid for the next 15 minutes. If you didn’t request this, please ignore this email.</p>
                  <a href="#" class="cta-button">Verify Your Email</a>
                </div>
                <div class="email-footer">
                  <p>Need help? <a href="#">Contact support</a></p>
                  <p>&copy; 2025 Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>`
    }
    Transpot.sendMail(mailOptions,function(error,res){
        if(error){
            console.log(error);
        }else{
            console.log("Message Sent")
        }
    })
}