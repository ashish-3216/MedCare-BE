import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    await auth.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

export default sendMail;
