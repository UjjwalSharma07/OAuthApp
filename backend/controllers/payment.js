const Razorpay = require("razorpay");
const { createError } = require("../utils/error");

exports.orderCreate = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.YOUR_RAZORPAY_KEY_ID, 
            key_secret: process.env.YOUR_RAZORPAY_KEY_SECRET, 
        });

        const { orderId, payment_capture, currency } = req.body;
        console.log("req body", req.body);
        const amount = Number(req.body.amount); 
       
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: orderId,
            payment_capture: payment_capture,
        }
        console.log("options",options)
        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating the order."
            })
        }
        return res.status(200).json({
            success: true,
            message: "Order created successfully.",
            data: order
        })

    } catch (err) {
        console.log(err);
        return next(
            createError(500, "Something went wrong in payment integration.")
        );
    }
}
