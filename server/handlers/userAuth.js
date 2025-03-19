/* eslint-disable @typescript-eslint/no-unused-vars */
const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function signupFunction(req, res) {
  try {
    const { fullName, email, password: plainTextPassword, phone } = req.body;

    console.log(email);

    const emailAlreadyExists = await User.findOne({
      email: req.body.email,
    });

    const phoneAlreadyExists = await User.findOne({
      phone: req.body.phone,
    });

    var phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phone)) {
      return res.json({ status: "error", error: "Invalid Phone Number" });
    }

    var flag = 0;
    if (emailAlreadyExists) {
      return res.json({ status: "error", error: "Email already taken" });
    } else if (phoneAlreadyExists) {
      return res.json({ status: "error", error: "Phone Number already taken" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "Password too small. Should be atleast 6 characters",
      });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      if (flag == 0) {
        const response = await User.create({
          fullName,
          email,
          password,
          phone,
        });
        console.log("User Created Successfully: ", response);
        return res.json({ status: 200, message: "User Created Successfully!" });
      }
    } catch (error) {
      if (error.code === 11000) {
        return res.json({
          status: "error",
          error: "email Already Exists!",
        });
      }
      throw error;
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: err.message,
    });
  }
}

//Login using email and password
async function loginFunction(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: 400, error: "Invalid email/Password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     email: user.email,
    //   },
    //   JWT_SECRET,
    //   {
    //     expiresIn: "10min",
    //   }
    // );

    // res.cookie("token", token, {
    //   httpOnly: true,
    // });

    return res.json({ status: 200, message: "Logged In Succesfully" });
  } else {
    return res.json({ status: 400, error: "Invalid email/Password" });
  }
}

// async function logoutFunction(req, res) {
//   res.clearCookie("token");

//   return res.status(200).json({
//     status: "ok",
//     // redirectTo: "/index.html",
//   });
// }

module.exports = {
  signupFunction,
  loginFunction,
  //   logoutFunction,
};
