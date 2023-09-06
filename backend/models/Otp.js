const mongoose = require("mongoose");
const { createError } = require("../utils/error");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresIn: {
    type: Number,
    required: true,
    default: 5 ,
  },
});

module.exports = mongoose.model("OTP", OTPSchema);
