const express = require('express');
const router = express.Router();

// Import Routes
const Solutions = require('./Solutions');
const Auth = require('./Auth')
// 
router.use('/solutions', Solutions);
router.use('/auth', Auth);

module.exports = router;