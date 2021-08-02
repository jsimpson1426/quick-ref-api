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
  if (error) return res.status(400).send(error.details[0].message);

  try{
    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      filename: req.body.filename,
      tags: [...req.body.tags]
    });

    const result = await resource.save();
    res.send(result);

  } catch (err){
    res.status(400).send(err.message);
  }

});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try{
    const resource = await Resource.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        description: req.body.description,
        filename: req.body.filename,
        tags: [...req.body.tags]
      }, 
      { new: true }
    );

    if (!customer) return res.status(404).send('Resource not found.');

    res.send(result);

  } catch (err){
    res.status(400).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  const deletedResource = Resource.findByIdAndDelete(req.params.id);
  if(!deletedResource) return res.status(404).send('Resource Not Found. Nothing was deleted.');

  res.send(deletedResource);
});

module.exports = router;