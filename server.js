const express = require('express'),
  app = express(),
  port = process.env.PORT ||  13337,
  path = require('path');
  
global.appRoot = path.resolve(__dirname);

app.use(express.static("public"));

app.listen(port);

console.log('Server started on port: ' + port);