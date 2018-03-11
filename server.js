var express = require('express'),
  app = express(),
  port = process.env.PORT || 80,
  mongoose = require('mongoose'),
  task = require('./api/models/listModel'),
  path = require('path'),
  bodyParser = require('body-parser');

global.appRoot = path.resolve(__dirname);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/listRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);