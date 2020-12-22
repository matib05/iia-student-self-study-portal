const mongoose = require("mongoose");
const utils = require('../utils/utils');

const UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true, uppercase: true },
    token: {type: String},
    securityQuestion: {type: String, required: true},
    securityAnswer: {type: String, required: true},
    userSubmissions: {type: mongoose.Schema.Types.ObjectId, ref: 'UserSubmission'},

});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    if (this.password) {
        utils.encryptPassword(this.password).then(hash => {
            this.password = hash;
            next();
        }).catch(error => {
            console.error(error);
        })
    }
});

module.exports = User = mongoose.model('IIAUsers', UserSchema);