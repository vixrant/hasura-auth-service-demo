const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/user');

const app = express();

app.use(bodyParser.json());
app.post('/auth/signup', userController.signUp);
app.post('/auth/signin', userController.signIn);

module.exports = app;
