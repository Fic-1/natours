const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  //* 1) Create a transporter - service that will send the email
  //?   const transporter = nodemailer.createTransport({
  //?     service: 'Gmail',
  //?         auth: {
  //?         user: process.env.EMAIL_USERNAME,
  //?         password: process.env.EMAIL_PASSWORD,
  //?        },
  //! ACTIVATE IN GMAIL "less secure app" option.
  //!- gmail is not good idea for production (500 mails per day)
  //?  });
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      type: 'login',
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //* 2) Define email options
  const mailOptions = {
    from: 'Filip Brkovic<filip.brkovic1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //* 3) Acctualy send the email

  await transporter.sendMail(mailOptions);
});
module.exports = sendEmail;
