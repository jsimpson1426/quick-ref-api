const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.send("This will be the users route.");
});

module.exports = router;