import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const { EMAIL, EMAIL_PASS } = process.env;

export const sendEmail = async (dataEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com", // Use the correct SMTP host
        port: 465,
        secure: true, // Use true for SSL
        auth: {
          user: EMAIL,
          pass: EMAIL_PASS,
        },
      });

      const response = await transport.sendMail(dataEmail);
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};
