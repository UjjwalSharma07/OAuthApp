
const Razorpay = require('razorpay');

exports.razorpay = new Razorpay({
    key_id_razorpay: process.env.YOUR_RAZORPAY_KEY_ID,
    key_secret_razorpay: process.env.YOUR_RAZORPAY_KEY_SECRET,
});
