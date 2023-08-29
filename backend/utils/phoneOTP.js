const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const phoneOTP = async (userPhone, otp) => {
    try {
        const client = new twilio.Twilio(accountSid, authToken);
        let info = await client.messages.create({
            body: `Your verification code: ${otp}`,
            from: '+12518422158',
            to: `+91${userPhone}`,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log("Error occurs in sending OTP via Phone:", error.message);
    }
};

module.exports = phoneOTP;
