const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {

  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const currentUser = await User.findOne({email: req.body.email});
  if(currentUser) return res.status(400).send('User Already Registered');

  const user = new User(_.pick(req.body, ['email','password','role']));

  const salt = await becrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const result = await user.save();

  const token = user.generateAuthToken();

  res.headers('x-auth-token', token).send(_.pick(user, ['_id','email']));

});

router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});


module.exports = router;