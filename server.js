var express = require('express'),
  app = express(),
  port = process.env.PORT || 4000,
  mongoose = require('mongoose'),
  path = require('path'),
  bodyParser = require('body-parser');
  
global.appRoot = path.resolve(__dirname);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port, 'localhost');

console.log('RESTful API server started on: ' + port);