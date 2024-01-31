const Razorpay = require("razorpay");
const crypto = require('crypto');
const axios = require('axios');

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

exports.newPayment = async (req,res,next)=>{
    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `https://oauthapp-8l6w.onrender.com/api/v1/user/payment/status/${merchantTransactionId}`,
            // redirectUrl: `http://localhost:8800/api/v1/user/payment/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data)
            return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

exports.checkStatus = async (req,res,next)=>{
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
    method: 'GET',
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
    }
    };

    // CHECK PAYMENT TATUS
    axios.request(options).then(async(response) => {
        if (response.data.success === true) {
            const url = `http://localhost:3000/success`
            return res.redirect(url)
        } else {
            const url = `http://localhost:3000/failure`
            return res.redirect(url)
        }
    })
    .catch((error) => {
        console.error(error);
    });
}