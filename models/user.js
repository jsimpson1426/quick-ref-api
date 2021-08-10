const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    },
    isAdmin:{
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));

    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(64).required(),
        isAdmin: Joi.boolean()
    };
  
    return Joi.object(schema).validate(user);
}
  

exports.User = User; 
exports.validate = validateUser;