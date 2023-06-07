const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  generateOTP,
  sendEmail,
};
