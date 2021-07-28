const {Resource, validate} = require('../models/resource');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const resources = await Resource.find();
  res.send(resources);
});

router.get('/:id', async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if(!resource) return res.status(404).send('Resource Not Found');

  res.send(resource);
});

router.post('/', async (req,res) => {
  const {error} = validate(req.body);
  if(error) return res.send(error.message[0]);
});

router.delete('/:id', async (req, res) => {
  const deletedResource = Resource.findByIdAndDelete(req.params.id);
  if(!deletedResource) return res.status(404).send('Resource Not Found. Nothing was deleted.');

  res.send(deletedResource);
});

module.exports = router;