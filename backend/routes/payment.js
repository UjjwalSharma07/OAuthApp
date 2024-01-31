const express = require("express");
const router = express.Router();

const { orderCreate ,newPayment ,checkStatus} = require("../controllers/payment");

router.post("/create",orderCreate);
router.post("/payment",newPayment);
router.post("/status/:txnId",checkStatus);

module.exports = router;