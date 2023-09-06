const OTP = require("../models/Otp");
const User = require("../models/User");

exports.verifyOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    // Find the most recent OTP entry in the database
    const otpEntry = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (!otpEntry || otpEntry.length === 0) {
      return res.status(404).json({
        success: false,
        message: "OTP entry not found.",
      });
    }

    const recentOtp = otpEntry[0];

    const currentTime = new Date();

    const otpExpirationTime = new Date(
      recentOtp.createdAt.getTime() + recentOtp.expiresIn * 60000
    );

    console.log("Current Time: ", currentTime);
    console.log("OTP Expiration Time: ", otpExpirationTime);

    if (currentTime > otpExpirationTime) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    if (recentOtp.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    await OTP.findByIdAndDelete(recentOtp._id);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
