const mongoose = require("mongoose");
const { createError } = require("../utils/error");


const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
    default: 5 ,
  },
},{timestamps:true});

module.exports = mongoose.model("OTP", OTPSchema);
