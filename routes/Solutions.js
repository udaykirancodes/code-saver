const express = require('express');
const router = express.Router();
const slug = require('slug');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');

// Import Models 
const Solution = require('../models/Solution');

const FetchUser = require('../FetchUser');

// get one solutions 
router.get('/', FetchUser, async (req, res) => {
    try {
        let sortObj = {
            updatedAt: -1
        }
        let query = { userid: req.user.id };
        let sol = await Solution.find(query).sort(sortObj);
        return res.status(200).json({ success: true, data: sol })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, msg: "Internal Server Error" })
    }
})
// get user solutions 
router.get('/:slug', FetchUser, async (req, res) => {
    try {
        let sortObj = {
            updatedAt: -1
        }
        let slug = req.params.slug;
        let query = { userid: req.user.id, slug: slug };
        let sol = await Solution.find(query).sort(sortObj);
        return res.status(200).json({ success: true, data: sol })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, msg: "Internal Server Error" })
    }
})

// Add Solutions
router.post('/add', FetchUser,
    [
        body('question', 'question must be there').isLength({ min: 3 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, msg: "Question is Required", errors: errors.array() });
            }
            const { question, tags, liked, solutions, link, difficulty } = req.body;
            let s = slug(question, { remove: '.' });

            let sol = await Solution.findOne({ slug: slug })

            if (sol) {
                return res.status(400).json({ success: false, msg: "Slug Already Found" })
            }
            const solution = new Solution({
                question: question,
                tags: tags,
                slug: s,
                liked: liked,
                userid: req.user.id,
                link: link,
                difficulty: difficulty,
                solutions: solutions
            })
            let saved = await solution.save();
            return res.status(200).json({ success: true, data: saved })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ success: false, msg: "Internal Server Error" })
        }
    })

// Update a Solution
router.put('/edit', FetchUser,
    [
        body('id', 'id is required').isLength({ min: 3 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, msg: "Id is required", errors: errors.array() });
            }
            let id = req.body.id;
            id = new mongoose.Types.ObjectId(id);
            let solution = await Solution.findOne({ _id: id, userid: req.user.id });
            if (!solution) {
                return res.status(400).json({ success: false, msg: "Not Found" })
            }
            let saved = await Solution.findByIdAndUpdate(id, { $set: req.body }, { new: true })
            return res.status(200).json({ success: true, data: saved });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ success: false, msg: "Internal Server Error" })
        }
    })

router.delete('/delete/:id', FetchUser, async (req, res) => {
    try {
        let id = req.params.id;
        let solution = await Solution.finOne({ _id: id, userid: req.user.id });
        if (!solution) {
            return res.status(400).json({ success: false, msg: "Not Found" })
        }
        let saved = await solution.deleteOne({ _id: id })
        return res.status(200).json({ success: true, data: saved });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, msg: "Internal Server Error" })
    }

})

module.exports = router