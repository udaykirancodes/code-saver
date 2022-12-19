const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const config = require('../config')

const User = require('../models/User');

// Register a User 
router.post('/register',
    [
        body('email', 'Email Error').isEmail(),
        body('password', 'Password Error').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, msg: "Error Occured", errors: errors.array() });
            }
            let { email, password } = req.body;
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ success: false, msg: "Email Already Exists" })
            }
            console.log('This')

            // Hash the Password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                email: email,
                password: hashedPassword
            })

            let savedUser = await user.save();

            return res.status(200).json({ success: true, data: savedUser })

        } catch (error) {

        }
    })

// [2].Login User 
router.post('/login',
    [
        body('email', 'Email Error').isEmail(),
        body('password', 'Password Error').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status: false, msg: "Error Occured", errors: errors.array() });
            }
            let { email, password } = req.body;
            let user = await User.findOne({ email: email });
            if (!user) { // if user not found 
                return res.status(400).json({ success: false, msg: "User Not Found !" })
            }
            // if found :: check password 
            let comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({ success: false, msg: "Invalid Credentials" });
            }

            // JWT TOKEN 
            let data = {
                user: {
                    id: user._id
                }
            }
            let authToken = await jwt.sign(data, config.jwt)
            res.status(200).json({ success: true, authToken: authToken })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, msg: "Internal Server Error" })
        }
    })

module.exports = router