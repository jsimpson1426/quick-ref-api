const {Resource, validate} = require('../models/resource');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const resources = await Resource.find();
    res.send(resources);
  }catch(err){
    res.status(400).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const resource = await Resource.findById(req.params.id);
    if(!resource) return res.status(404).send('Resource Not Found');

    res.send(resource);
  }catch(err){
    res.status(400).send(err.message);
  }
});

router.post('/', async (req,res) => {
  try{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
  try{
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const resource = await Resource.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        description: req.body.description,
        filename: req.body.filename,
        tags: [...req.body.tags]
      }, 
      { new: true }
    );

    if (!resource) return res.status(404).send('Resource not found.');

    res.send(resource);

  } catch (err){
    res.status(400).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if(!deletedResource) return res.status(404).send('Resource Not Found. Nothing was deleted.');

    res.send(deletedResource);

  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
  
});

module.exports = router;