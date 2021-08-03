const mongoose = require('mongoose');
const express = require('express');

const resources = require('./routes/resources');
const users = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost/switchBase', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/resources', resources);
app.use('/api/users', users);

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));