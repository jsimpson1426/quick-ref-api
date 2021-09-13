const config = require('config');
const mongoose = require('mongoose');
const express = require('express');

const resources = require('./routes/resources');
const users = require('./routes/users');
const login = require('./routes/auth');

const app = express();

if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1);
}

mongoose.connect('mongodb://localhost/quickRef', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/resources', resources);
app.use('/api/login', login);
app.use('/api/users', users);

app.use(express.static('public'));

<<<<<<< HEAD
const port = process.env.PORT || 3001;
=======
const port = process.env.PORT || 5000;
>>>>>>> 6378832f0693b9ba29f8e2c5826ee9fd9e7db26a
app.listen(port, () => console.log(`Listening on port ${port}...`));