const express = require('express');
const router = express.Router();
const assignmentService = require('../services/assignment.service');
const utils = require('../utils/utils');
const {protect} = require("../middleware/auth.middlware");

router.get( '/', protect, (req, res) => {
    assignmentService.getAllAssignmentsForUser(req.user).then(assignments => {
        utils.generateToken(req.user._id).then(token => {
            let response = {
                assignments: assignments.assignments,
                overallGrade: assignments.overallGrade,
                token
            }
            res.status(200).json(response);
        });
    }).catch(error => {
        res.status(500).send({message: error.message});
    })
});

router.get('/:id', protect, (req, res) => {
    let id = req.params.id;
    let showAnswers = req.query;
    console.log(req);
    assignmentService.getAssignmentById(id).then(assignment => {
        utils.generateToken(req.user._id).then(token => {
            let response = {
                assignment,
                token
            }
            res.status(200).json(response);
        });
    }).catch(error => {
        res.status(500).send({message: error.message});
    })
});

router.post('/:id', protect, (req, res) => {
    let assignmentId = req.params.id;
    console.log(req.body);
    if (utils.isUserAssignmentSubmissionValid(req.body)) {
        assignmentService.gradeAndSubmitAssignment(assignmentId, req.user.email, req.body.userAnswers).then(submissionResponse => {
            utils.generateToken(req.user._id).then(token => {
                let response = {
                    submissionResponse,
                    token
                }
                res.status(200).json(response);
            });
        })
    } else {
        res.status(400).json('bad request')
    }
} )

router.post('/', protect, (req, res) => {
    if (req.user.isAdmin) {
        if (utils.isCreateAssignmentRequestValid(req.body.assignment)) {
            const { questions, isActive, title, dueDate } = req.body.assignment;
            assignmentService.createAssignment(questions, isActive, title, dueDate).then(question => {
                utils.generateToken(req.user._id).then(token => {
                    let response = {
                        question,
                        token
                    }
                    res.status(200).json(response);
                });
            })
        } else {
            res.status(400).json('bad request')
        }
    } else {
        res.status(403).json({
            errorMessage: 'You do not have permissions to do this action'
        })
    }
});

module.exports = router;