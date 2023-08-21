const Question = require('../models/Questions');
const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');

// Get all questions
exports.getQuestions = asyncErrorHandler(async (req, res, next) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// Post a vote
exports.castVote = asyncErrorHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const { optionText, userId } = req.body;

    try {
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if the user has already voted for this question
        if (question.votedBy.includes(userId)) {
            return res.status(400).json({ message: 'User has already voted for this question' });
        }

        // Find the selected option by its optionText
        const selectedOption = question.options.find(
            (opt) => opt.optionText === optionText
        );

        if (!selectedOption) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        // Update the votes for the selected option
        selectedOption.votes += 1;

        // Add the userId to votedBy array
        question.votedBy.push(userId);

        await question.save();

        res.json({ message: 'Vote submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting vote' });
    }
});



// Post a question
exports.postQuestion = asyncErrorHandler(async (req, res, next) => {
    const { question, options } = req.body;
    try {
        const optionsWithVotes = options.map((opt) => ({
            optionText: opt,
            votes: Number(0)
        }));
        const newQuestion = new Question({
            question,
            options: optionsWithVotes
        });
        await newQuestion.save();

        res.json({ message: 'Question posted successfully' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error posting question' });
    }
});


// Get a question
exports.getAQuestion = asyncErrorHandler(async (req, res, next) => {
    const { questionId } = req.params;
    try {
        const questions = await Question.find(questionId);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions' });
    }
});