const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');
const { getQuestions, castVote, postQuestion } = require('../controllers/daoController');

// Get all questions
router.get('/questions/', getQuestions);

router.get('/', getQuestions);

// Vote for an option
router.post('/dao/vote/:questionId', castVote);

// Post a question
router.post('/question/', postQuestion);

router.get('/hello', (req, res) => {
    res.send("Hello");
})

// router.route('/admin/reviews')
//     .get(getQuestions)
//     .post(castVote);

module.exports = router;
