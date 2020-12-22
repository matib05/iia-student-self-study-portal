const mongoose = require("mongoose");

const userAnswersSchema = new mongoose.Schema({
    questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true},
    userAnswer: {type: String, required: true},
    correct: {type: Boolean}
})

const UserSubmissionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignment: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true},
    userAnswers: [userAnswersSchema],
    grade: {type: Number }
});

module.exports = UserSubmission = mongoose.model('UserSubmission', UserSubmissionSchema);