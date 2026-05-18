import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ Gmail connection failed:", error);
  } else {
    console.log("✅ Gmail server ready");
  }
});

const sendMail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    console.log("📨 Sending email to:", to);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Mail error:", error);
  }
};

export default sendMail;