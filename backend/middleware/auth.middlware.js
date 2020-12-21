const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

module.exports.protect = (req, res, next) => {
    console.log('here in protect');
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decoded.id).select('-password').then(user => {
            req.user = user;
            next()
        }).catch(error => {
            console.error(error);
            res.status(401).json({
                message: 'Not authorized, token failed',
                stack: process.env.NODE_ENV === 'production' ? null : error.stack
            })
        });
    }

    if (!token) {
        res.status(401).json({
            message: 'Not authorized, no token',
        })
    }
};