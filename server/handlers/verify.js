const nodemailer = require("nodemailer");

let verificationCodes = {};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000);
  verificationCodes[email] = code;

  // Setup email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP details
    auth: {
      user: "manoj.k2021@vitstudent.ac.in",
      pass: "faxr ikoe yitb pkxs",
    },
  });

  const mailOptions = {
    from: "manoj.k2021@vitstudent.ac.in",
    to: email,
    subject: "UniRide Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
    console.log(error);
  }
};

const verifyCode = (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] && verificationCodes[email] == code) {
    delete verificationCodes[email]; // Clear code after verification
    return res.status(200).json({ message: "Code verified" });
  }
  return res.status(400).json({ message: "Invalid code" });
};

module.exports = { sendVerificationCode, verifyCode };
