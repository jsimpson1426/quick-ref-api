const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User, validate } = require('../models/user');

const router = express.Router();

//Takes an email and password
// returns a JWT and the user ID and Email given that email is not already in DB
router.post('/', async (req, res) => {

  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const currentUser = await User.findOne({email: req.body.email});
  if(currentUser) return res.status(400).send('User Already Registered');

  const user = new User(_.pick(req.body, ['email','password','isAdmin']));

  //default isAdmin to false for all new users
  user.isAdmin = false;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id','email']));

});

//given a jwt in the header provide all user details for the requestor except the password
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if(!user) return res.status(404).send('User not found.');

  res.send(user);
});


router.get('/:id', [auth,admin], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if(!user) return res.status(404).send('User not found.');

  res.send(user);
});

router.put('/make-admin/:id', [auth,admin], async (req, res) => {
  let user = await User.findByIdAndUpdate(req.params.id,{
    isAdmin: true
  });

  res.send(_.pick(user, ['_id','email']));

});


module.exports = router;