const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const OTP = require("../models/Otp");
const mailSender = require("../utils/mailSender");
const phoneOTP = require("../utils/phoneOTP");

require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return next(createError(403, "User already exists."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const { password, confirmPassword, ...userDetails } = req.body;
    const newUser = new User({
      ...userDetails,
      password: hash,
    });
    await newUser.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "User registered successfully. Please verify your account.",
      });
  } catch (err) {
    console.log(err);
    return next(
      createError(500, "User cannot be registered. Please try again later.")
    );
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    const { password, ...otherDetails } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ 
        details: { ...otherDetails } ,
        success:true,
        message:"Login successfully."
      });
  } catch (err) {
    console.log(err);
    return next(createError(500, "Login failed."));
  }
};

exports.sendOTP = async (req, res, next) => {
  // fetch email from req ki body
  try {
    const { email } = req.body;

    // check if user alreaady exist
    const checkUserPresent = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User not exits. Register your account.",
      });
    }
    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    const otpPayload = { email, otp };

    // create an enrty for db
    const otpBody = await OTP.create(otpPayload);
    console.log("otpBody: ", otpBody);
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (emailPattern.test(email)) {
      // verify by email send otp to email
      await mailSender(email, "Verification email from Code8 Team", `Your verification code: <b>${otp}</b>`);
      console.log("Email sent successfully");
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. Check your mail.",
      });

    } else if (phonePattern.test(email)) {
      // verify by phone send otp to phone
      await phoneOTP(email, otp);

      console.log("OTP sent.");
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. Check your phone.",
      });
    }
  } catch (error) {
    next(error);
  }
};


exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, newpassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newpassword !== confirmPassword) {
      return next(createError(400, "Passwords do not match."));
    }

    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found."));
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpassword, salt);

    // Update the user's password in the database
    await User.findOneAndUpdate({ email }, { password: hash ,confirmPassword:confirmPassword },{new:true});

    // Send a password change confirmation email
    await mailSender(
      user.email,
      "Password Changed",
      "Your password has been successfully changed."
    );

    return res.status(200).json({
      success: true,
      message: "Password Reset.",
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Password reset failed. Please try again later."));
  }
};