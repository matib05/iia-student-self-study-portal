const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    choices: { type: Array, required: true},
    userAnswer: { type: String, require: false}
});

const AssignmentSchema = new mongoose.Schema({
    questions: [QuestionSchema],
    date: {type: Date },
    title: { type: String, required: true },
    isActive: {type: Boolean, require: true},
});

module.exports = Assignment = mongoose.model('Assignments', AssignmentSchema);