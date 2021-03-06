const uploadPath = './public/uploads/';

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Resource, validate} = require('../models/resource');

const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

//multer storage setup
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//multer file limitations
const limits = {fileSize: 80000000, files: 1};

//upload function initialized
const upload = multer({storage: storage, limits: limits}).single('file');


router.get('/',auth, async (req, res) => {
  try{
    const resources = await Resource.find();
    res.send(resources);
  }catch(err){
    res.status(400).send(err.message);
  }
});

router.get('/:id',auth, async (req, res) => {
  try{
    const resource = await Resource.findOne({ _id: req.params.id });
    if(!resource) return res.status(404).send('Resource Not Found');
    res.send(resource);
  }catch(err){
    res.status(400).send(err.message);
  }
});

router.post('/',[auth,admin, upload], async (req,res) => {
  try{

    req.body.filename = req.file.filename;
    if(req.body.tags){
      req.body.tags = JSON.parse(req.body.tags);
    }
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.filename,
      tags: req.body.tags
    });

    const result = await resource.save();
    res.send(result);

  } catch (err){
    await fs.unlink(uploadPath + req.filename);
    res.status(400).send(err.message);
  }

});

router.put('/:id', [auth,admin,upload], async (req, res) => {
  try{

    const resource = await Resource.findOne({ _id: req.params.id });
    if (!resource) return res.status(404).send('Resource not found.');

    //mongoose adds fields _id, $__ and __v which causes the validate function to throw an error
    //this validatResource removes that possibility
    let validResource = {
      title: req.body.title,
      description: req.body.description,
      filename: resource.filename,
      tags: JSON.parse(req.body.tags)
    }
    
    const { error } = validate(validResource);
    if (error) return res.status(400).send(error.details[0].message);

    resource.title = validResource.title;
    resource.description = validResource.description;
    resource.tags = validResource.tags;

    const result = await resource.save();
    res.send(result);

  } catch (err){
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete('/:id', [auth,admin], async (req, res) => {
  const deletedResource = await Resource.findByIdAndDelete(req.params.id);
  if(!deletedResource) return res.status(404).send('Resource Not Found. Nothing was deleted.');
  
  res.send(deletedResource);
  fs.unlink(uploadPath + deletedResource.filename, (err) =>{
    if(err){
      console.log(err);
      res.status(400).send(err.message);
    }
  });
  
});

module.exports = router;