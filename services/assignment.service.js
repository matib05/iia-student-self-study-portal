const Assignment = require('../models/assignment.model');
const User = require('../models/user.model');
const UserSubmission = require('../models/user-submission.model');
const moment = require('moment');


module.exports.getAllAssignmentsForUser = (user) => {
    return new Promise((resolve, reject) => {
        Assignment.find({}).select('title _id date').lean().then(assignments => {
            const assignmentIds = assignments.map(assignment => (assignment._id));
            getAllSubmittedAssignments(user, assignmentIds).then(gradedSubmissions => {
                assignments.forEach(assignment => {
                    gradedSubmissions.forEach(gradedAssignment => {
                        if (assignment._id.toString() === gradedAssignment.assignment.toString()) {
                            assignment['grade'] = gradedAssignment.grade;
                        }
                    })
                });
                let overallGrade = getOverallGrade(gradedSubmissions);
                resolve({assignments, overallGrade});
            })
        }).catch(error => {
            console.error(error.message);
            reject(error);
        })
    })
}

const getAllSubmittedAssignments = (user, assignments) => {
    return new Promise((resolve, reject) => {
        UserSubmission.find({assignment: assignments, user: user}).lean().then(submissions => {
            resolve(submissions);
        }).catch(error => {
            console.error(error);
            reject(new Error('Cannot find submissions'));
        });
    })
}

const getOverallGrade = gradedAssignments => {
    let grades = [];
    gradedAssignments.forEach(assignment => {
        grades.push(assignment.grade);
    })
    if (grades.length > 0) {
        return grades.reduce((a, b) => a + b) / grades.length;
    } else {
        return null;
    }

}


module.exports.getAssignmentById = id => {
    return new Promise((resolve, reject) => {
        Assignment.findById(id).select('-questions.correctAnswer').then(assignment => {
            assignment.questions.forEach(question => {
                question.choices = shuffle(question.choices);
            })
            resolve(assignment)
        }).catch(error => {
            console.error(error);
            reject(error);
        })
    })
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports.getAssignment = () => {
    return new Promise((resolve, reject) => {
        const today = moment().startOf('day')
        Assignment.find({date: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }}).then(assignment => {
            resolve(assignment);
        }).catch(error => {
            console.error(error.message);
            reject(error);
        })
    });
}

module.exports.gradeAndSubmitAssignment = (id, email, userAnswers) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}).then(user => {
            if (user) {
                Assignment.findById(id).then(assignment => {
                    this.gradeAssignment(userAnswers, assignment).then(grade => {
                        let userSubmission = {
                            user: user.id,
                            assignment: assignment.id,
                            userAnswers: userAnswers,
                            grade: grade
                        }
                        UserSubmission.create(userSubmission).then(submittedAnswers => {
                            if (submittedAnswers) {
                                resolve({isSubmitted: true, grade});
                            }
                        })
                    })
                })
            } else {
                reject(new Error('Invalid User'));
            }
        }).catch(error => {
            console.error(error);
            reject(new Error('Assignment Creation Error'));
        });
    });
}


module.exports.createAssignment = (questions, isActive, title, date) => {
    return new Promise((resolve, reject) => {
        Assignment.create({questions: questions, date: date, title: title, isActive: isActive}).then(assignment => {
            resolve({isCreated: true, assignment});
        }).catch(error => {
            console.error(error);
            reject(new Error('Assignment Creation Error'));
        });
    });
}

module.exports.gradeAssignment = (userAnswers, assignment) => {
    return new Promise((resolve, reject) => {
        let correct = 0;
        assignment.questions.forEach(question => {
            userAnswers.forEach(answer => {
                if (question._id.toString() === answer.questionId) {
                    if (question.correctAnswer === answer.userAnswer) {
                        correct++
                        answer.userAnswer.correct = true;
                    } else {
                        answer.userAnswer.correct = false;
                    }
                }
            })
        })
        let grade = (correct / assignment.questions.length) * 100
        resolve(grade)
    })
}
