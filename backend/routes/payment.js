const express = require("express");
const router = express.Router();

const { orderCreate } = require("../controllers/payment");

router.post("/create",orderCreate);

module.exports = router;