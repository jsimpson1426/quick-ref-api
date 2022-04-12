const Joi = require('joi');
const mongoose = require('mongoose');

const Resource = mongoose.model('Resource', new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            minlength: 1,
            maxlength: 64
        },
        description:{
            type: String,
            minlength: 1,
            maxlength: 1024
        },
        filename:{
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
            unique: true
        },
        tags:{
            type: Array
        }
    }
));

function validateResource(resource) {
    const schema = {
        title: Joi.string().min(1).max(64).required(),
        description: Joi.string().min(1).max(1024),
        filename: Joi.string().min(1).max(64).required(),
        tags: Joi.array().max(5)
    };
  
    return Joi.object(schema).validate(resource);
}
  

exports.Resource = Resource; 
exports.validate = validateResource;