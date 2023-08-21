const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [
        {
            optionText: {
                type: String,
                required: true,
            },
            votes: {
                type: Number,
                default: 0,
            },
        },
    ],
    votedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
});


module.exports = mongoose.model("Question", questionSchema);