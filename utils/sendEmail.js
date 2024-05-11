const nodeMailer = require("nodemailer");
const sendEmail = async (options) => {
  let testAccount = await nodeMailer.createTestAccount();
  const transporter = await nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "marie.wisozk@ethereal.email",
      pass: "Q1kBBsAzf4sX7nJtFz",
    },
  });
  console.log(options.email);
  const mailOptions = {
    from: "jagriti",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
