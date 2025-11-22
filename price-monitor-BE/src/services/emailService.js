const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function verifyTransport() {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function sendEmail({ to, subject, text, html }) {
  const mailOptions = { from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text, html };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail, verifyTransport };
