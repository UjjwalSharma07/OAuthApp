const express = require('express');
const { createUserDetails, getUserDetails, editUserDetails, subscribe } = require('../controllers/userDetails');

const router = express.Router();


router.get('/details',getUserDetails);
router.post('/subscribe',subscribe);
router.post('/detailsUpload',createUserDetails);
router.put('/editdetailsUpload',editUserDetails);


module.exports =  router;
