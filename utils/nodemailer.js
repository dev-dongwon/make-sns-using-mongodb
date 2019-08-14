const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const mailForm = async(address) => {
  const token = jwt.sign({ address }, process.env.JWT_SECRET);
  return `<a href='${process.env.SITE_URI}/auth/resetpassword?token=${token}'">Reset Password</a>`;
}

const sendEmail = async (address) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    requireTLS : true,
    secure: false,
    auth: {
      user: 'morellospirit@gmail.com', 
      pass: process.env.MAILER_PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: '"Daily Frame" <morellospirit@gmail.com>',
    to: address,
    subject: "[Daily Frame] 비밀번호 찾기 안내",
    html: await mailForm(address)
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail;