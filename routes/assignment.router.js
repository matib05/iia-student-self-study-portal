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

router.post('/', (req, res) => {
    if (utils.isCreateAssignmentRequestValid(req.body)) {
        const { questions, isActive, title } = req.body;
        assignmentService.createAssignment(questions, isActive, title, new Date()).then(question => {
            // utils.generateToken(req.user._id).then(token => {
                let response = {
                    question,
                    // token
                }
                res.status(200).json(response);
            // });
        })
    } else {
        res.status(400).json('bad request')
    }
});

module.exports = router;