import nodemailer from "nodemailer";

const sendCredentialsMail = async (toEmail, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // sending using this email
      pass: process.env.EMAIL_PASS, // application password
    },
  });

  const mailOptions = {
    from: `"Voting System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Voting Account Credentials",
    text: text,
  };
  
  await transporter.sendMail(mailOptions);
};

export default sendCredentialsMail;