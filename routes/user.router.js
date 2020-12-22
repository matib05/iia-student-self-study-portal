const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const utils = require('../utils/utils');
const constants = require('../utils/constants');
const { protect } = require('../middleware/auth.middlware');

router.post('/login', (req, res) => {
  if (req.body.email && req.body.password) {
    const {email, password } = req.body;
    userService.getUser(email, password).then(user => {
      utils.generateToken(user._id).then(token => {
        let userResponse = {
          email: user.email,
          name: user.name,
          token: token
        }
        res.status(200).send(userResponse);
      }).catch(error => {
        console.error(error.message);
        res.sendStatus(500)
      })

    }).catch(error => {
      res.status(500).send({message: error.message});
    })
  } else {
    res.status(400).send({message: constants.USER_DETAILS_NOT_PROVIDED_ERROR});
  }
});

router.post('/register', (req, res) => {
  if (utils.isUserRegisterRequestValid(req.body)) {
    const user = {
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      name: req.body.name.toUpperCase(),
      securityQuestion: req.body.securityQuestion,
      securityAnswer: req.body.securityAnswer.toLowerCase()
    }
    userService.createUser(user).then(newUser => {
      utils.generateToken(newUser._id).then(token => {
        let userResponse = {
          email: newUser.email,
          name: newUser.name,
          token: token
        }
        res.status(200).send(userResponse);
      }).catch(error => {
        console.error(error.message);
        res.sendStatus(500)
      })
    }).catch(error => {
      if ('user already exists' === error.message) {
        res.status(400).send({message: error.message});
      } else {
        res.status(500).send({message: error.message});
      }
    })
  } else {
    res.status(400).send({message: constants.USER_DETAILS_NOT_PROVIDED_ERROR});
  }
});

router.post('/checkUser', (req, res) => {
  if (req.body.email && req.body.name && req.body.securityQuestion && req.body.securityAnswer) {
    const {email, name, securityQuestion, securityAnswer } = req.body;
    userService.getUserByEmailNameAndSecurityAnswer(email, name.toUpperCase(), securityQuestion, securityAnswer.toLowerCase()).then(userObjectFound => {
      if (userObjectFound) {
        utils.generateToken(userObjectFound.user._id).then(token => {
          let userResponse = {
            token: token,
            email: userObjectFound.user.email,
            isAnswerCorrect: userObjectFound.isAnswerCorrect
          }
          res.status(200).send(userResponse);
        }).catch(error => {
          console.error(error);
          res.sendStatus(500).json(error);
        })
      }

    }).catch(error => {
      console.error(error.message);
      res.sendStatus(500)
    })
  } else {
    res.status(400).send({message: constants.USER_DETAILS_NOT_PROVIDED_ERROR});
  }
});

router.post('/changePassword', protect, (req, res) => {
  if (req.body.password) {
    userService.updateUser(req.user, req.body.password).then(user => {
      utils.generateToken(req.user.id).then(token => {
        let userResponse = {
          email: user.email,
          name: user.name,
          token: token
        }
        res.status(200).send(userResponse)
      }).catch(error => {
        console.error(error.message);
        res.status(500).json({error: error.message})
      })
    }).catch(error => {
      res.status(500).json({error: error.message});
    })
  } else {
    res.status(400).send({message: constants.USER_DETAILS_NOT_PROVIDED_ERROR});
  }
});

module.exports = router;
