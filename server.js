const express = require('express'),
  app = express(),
  port = process.env.PORT || 4000,
  path = require('path');
  
global.appRoot = path.resolve(__dirname);
express.static.mime.define({'application/octet-stream': ['csv']})

app.use(express.static("public"));

app.listen(port);

console.log('server started on: ' + port);