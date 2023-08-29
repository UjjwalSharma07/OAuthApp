const OTP = require("../models/Otp");
const User = require("../models/User");


exports.verifyOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    // Find the OTP entry in the database 
    const otpEntry = await OTP.findOne({ email }).sort({createdAt:-1});
    console.log("recent otp from db: ",otpEntry);
    
    if (!otpEntry) {
      return res.status(404).json({
        success: false,
        message: "OTP entry not found.",
      });
    }
   
    const currentTime = new Date();
    const otpExpirationTime = new Date(
      otpEntry.createdAt.getTime() + otpEntry.expiresIn * 1000
    );
    if (currentTime > otpExpirationTime) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    if (otpEntry.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    // update isVerified true after otp verification
    await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true }); 

    await OTP.findOneAndDelete({ email });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



