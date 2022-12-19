const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    question: {
        type: String,
        max: 30,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    link: {
        type: String,
        required: false
    },
    difficulty: {
        type: String,
        required: false,
    },
    tags: {
        type: Array,
        default: []
    },
    liked: {
        type: Boolean,
    },
    slug: {
        type: String,
        max: 30
    },
    solutions: [
        {
            language: {
                type: String,
            },
            code: {
                type: String,
            },
            _id: false
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("Solution", UserSchema); 