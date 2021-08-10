const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const {User} = require('../models/user');
const _ = require('lodash');
const Joi = require('joi');
const router = express.Router();

function validate(req){
  const schema = {
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(1).max(64).required()
  }

  return Joi.object(schema).validate(req.body);
}

router.post('/', async (req, res) => {

  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const validUser = await User.findOne({email: req.body.email});
  if(!validUser) return res.status(400).send('Invalid Email or Password');

  const validPassword = bcrypt.compare(req.body.password, validUser.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');

  const token = validUser.generateAuthToken();
  res.send(token);

});

module.exports = router;