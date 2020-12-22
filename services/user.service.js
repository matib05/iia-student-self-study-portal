const utils = require('../utils/utils');
const User = require('../models/user.model');
const constants = require('../utils/constants');

module.exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject(new Error(constants.USER_DETAILS_NOT_PROVIDED_ERROR));
    } else {
      User.findOne({email}).then(user => {
        if (user) {
          utils.matchPassword(password, user.password).then(isMatch => {
            if (isMatch) {
              resolve(user)
            } else {
              reject(new Error(constants.INVALID_PASSWORD_ERROR))
            }
          }).catch(error => {
            reject(new Error(error.message));
          })
        } else {
          reject(new Error(constants.USER_DOES_NOT_EXIST_ERROR));
        }
      }).catch(error => {
        reject(new Error(error.message))
      });
    }
  });
}

module.exports.createUser = userDetails => {
  return new Promise((resolve, reject) => {
    if (!userDetails) {
      reject(new Error(constants.USER_DETAILS_NOT_PROVIDED_ERROR));
    } else {
      User.find({email: userDetails.email}).then(userExists => {
        if (userExists && userExists.length) {
          reject(new Error(constants.USER_EXISTS_ERROR));
        } else {
          User.create(userDetails).then(user => {
            resolve(user);
          }).catch(error => {
            console.error(error.message);
            reject(new Error(constants.USER_CREATION_ERROR));
          });
        }
      });
    }
  });
}

module.exports.getUserByEmailNameAndSecurityAnswer = (email, name, securityQuestion, securityAnswer) => {
  return new Promise((resolve, reject) => {
    if (!email || !name) {
      reject(new Error(constants.USER_DETAILS_NOT_PROVIDED_ERROR));
    } else {
      User.findOne({email:email, name: name, securityQuestion: securityQuestion, securityAnswer: securityAnswer}).lean().then(user => {
        if (user) {
          resolve({user: user, isAnswerCorrect: true});
        } else {
          resolve({isAnswerCorrect: false});
        }
      }).catch(error => {
        console.error(error.message);
        reject(new Error('User Search error ' + error.message));
      })
    }
  })
}

module.exports.updateUser = (user, password) => {
  return new Promise((resolve, reject) => {
    if (!user || !password) {
      reject(new Error(constants.USER_DETAILS_NOT_PROVIDED_ERROR));
    } else {
      user.password = password;
      user.save().then(user => {
        resolve(user)
      }).catch(error => {
        console.error(error.message);
        reject(new Error('User Password Update Error'));
      })
    }
  })
}