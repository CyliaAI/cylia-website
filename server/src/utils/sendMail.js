import nodemailer from 'nodemailer';
import 'dotenv/config';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;
const TLS = process.env.ALLOW_UNAUTHORIZED_CERTS ? { rejectUnauthorized: false } : undefined;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: TLS,
});

export const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: SENDER_EMAIL || SMTP_USER,
    to,
    subject,
    html,
  };

  return await transporter
    .sendMail(mailOptions)
    .then((info) => {})
    .catch((error) => {
      console.error('Error sending email:', error);
      return error;
    });
};
