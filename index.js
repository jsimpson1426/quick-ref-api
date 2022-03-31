const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const resources = require('./routes/resources');
const users = require('./routes/users');
const login = require('./routes/auth');

//For production
const helmet = require('helmet');
const compression = require('compression');
//

const app = express();

if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

//For Production
app.use(helmet());
app.use(compression());
//

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/resources', resources);
app.use('/login', login);
app.use('/users', users);

app.use(express.static('public'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));