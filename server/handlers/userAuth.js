/* eslint-disable @typescript-eslint/no-unused-vars */
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10min",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ status: 200, message: "Logged In Succesfully" });
  } else {
    return res.json({ status: 400, message: "Invalid email/Password" });
  }
}

async function logoutFunction(req, res) {
  res.clearCookie("token");

  return res.json({
    status: 200,
    message: "Logged Out Successfully",
  });
}

async function getDataFunction(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const rating = user.averageRating.toFixed(1);
    // Assuming user data contains the required fields
    const userData = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      numberOfRides: user.numberOfRides,
      ratings: rating,
    };

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching User data", error);
    res.json({ success: false, message: "Error fetching User data" });
  }
}

const updateProfileFunction = async (req, res) => {
  const { name, phone } = req.body;

  try {
    req.user.fullName = name;
    req.user.phone = phone;
    await req.user.save();

    res.json({ status: 200, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAccountFunction = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
      return res.json({ status: 400, message: "Incorrect current password" });
    }

    req.user.email = email;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      req.user.password = hashedPassword;
    }

    await req.user.save();
    res.json({ status: 200, message: "Account updated successfully" });
  } catch (error) {
    console.error("Account update error:", error);
    res.json({ status: 500, message: "Server error" });
  }
};

module.exports = {
  signupFunction,
  loginFunction,
  getDataFunction,
  logoutFunction,
  updateProfileFunction,
  updateAccountFunction,
};
