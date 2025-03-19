require('dotenv').config();
const nodemailer = require('nodemailer');

const emailFrom = process.env.EMAIL_ADDRESS;
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailFrom,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendEmail(emailTo, subject, htmlContent) {
  let mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail
}