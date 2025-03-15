import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  // secure: false, // true for port 465, fsalse for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Email Verification for Ecommerce", // Subject line
    html: `
    <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
      }
      .otp {
          font-size: 24px;
          font-weight: bold;
          color: #ff6600;
          margin: 20px 0;
          padding: 10px;
          background: #f8f8f8;
          display: inline-block;
          border-radius: 5px;
      }
      .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
      }
    </style>
    <div class="container">
      <h2>Email Verification</h2>
      <p>Use the OTP below to verify your email address:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
    `, // html body
  });

  console.log("Message sent:", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?email=${email}&token=${resetToken}`;
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Reset Password for Ecommerce", // Subject line
    html: `
    <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
      }
      .button {
          display: inline-block;
          background-color: #ff6600;
          color: #ffffff;
          padding: 12px 20px;
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
          border-radius: 5px;
          margin-top: 20px;
      }
      .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
      }
    </style>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you didn't request this, you can ignore this email.</p>
      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
  `});

  console.log("📩 Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};


export { sendOTPEmail, sendResetPasswordEmail };