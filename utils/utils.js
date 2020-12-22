const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('./constants');

module.exports.connectToDatabase = (dbUri) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(connection => {
            console.log(`${constants.DATABASE_CONNECTION_SUCCESS}${connection.connection.host}`)
            resolve(connection);
        }).catch(error => {
            reject(new Error(`${constants.DATABASE_CONNECTION_FAILURE}${error.message}`))
        })
    });
}

module.exports.encryptPassword = userPassword => {
    return new Promise((resolve, reject) => {
        if (!userPassword) {
            reject(new Error(constants.MISSING_PARAMETERS_ERROR('userPassword')));
        } else {
            bcrypt.genSalt(constants.SALT_ROUNDS).then(salt => {
                bcrypt.hash(userPassword, salt).then(hashedPassword => {
                    resolve(hashedPassword);
                }).catch(hashError => {
                    reject(hashError);
                })
            }).catch(genSaltError => {
                reject(genSaltError);
            })
        }
    })
    
}

module.exports.isUserRegisterRequestValid = requestBody => {
    return !!(requestBody.email && requestBody.password && requestBody.name && requestBody.securityQuestion && requestBody.securityAnswer);
}

module.exports.isCreateQuestionRequestValid = requestBody => {
    return requestBody.question && requestBody.correctAnswer && requestBody.choices && requestBody.date;
}

module.exports.isUserAssignmentSubmissionValid = requestBody => {
    return requestBody.userAnswers && requestBody.userAnswers.length > 0;
}

module.exports.isCreateAssignmentRequestValid = requestBody => {
    return requestBody.questions && requestBody.questions.length > 0 && requestBody.isActive && requestBody.title;
}

module.exports.generateToken = id => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject(Error(constants.MISSING_PARAMETERS_ERROR('id')))
        }
        resolve(jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '5m'}));
    });
}

module.exports.matchPassword = (enteredPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        if (!enteredPassword || !hashedPassword) {
            reject(new Error(constants.MISSING_PARAMETERS_ERROR('enteredPassword, hashedPassword')));
        } else {
            bcrypt.compare(enteredPassword, hashedPassword).then(isMatch => {
                resolve(isMatch);
            }).catch(error => {
                reject(error);
            })
        }
    })
}

module.exports.getTodaysDate = () => {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}=${date.getDate()}`
}