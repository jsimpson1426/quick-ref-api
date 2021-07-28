const Joi = require('joi');
const mongoose = require('mongoose');

const Resource = mongoose.model('Resource', new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    description:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    filename:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true
    },
    tags:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024
    }
}));

function validateUser(user) {
    const schema = {
        title: Joi.string().min(1).max(64).required(),
        description: Joi.string().min(1).max(1024).required(),
        filename: Joi.string().min(1).max(64).required(),
        tags: Joi.array().max(5)
    };
  
    return Joi.validate(user, schema);
}
  

exports.Resource = Resource; 
exports.validate = validateResource;