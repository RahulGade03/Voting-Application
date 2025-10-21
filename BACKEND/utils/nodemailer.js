import nodemailer from "nodemailer";

const sendCredentialsMail = async (toEmail, text) => {
  // console.log("Setting up transporter for email");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,        
      pass: process.env.EMAIL_PASS,        
    },
  });

  // console.log("Preparing to send email to: "+toEmail);

  const mailOptions = {
    from: `"Voting System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Voting Account Credentials",
    text: text,
  };
  // console.log("Sending email to: "+toEmail);
  await transporter.sendMail(mailOptions);
  // console.log("Email sent to: "+toEmail);
};

export default sendCredentialsMail;