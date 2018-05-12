'use strict';

var mongoose = require('mongoose'),
  path = require('path'),
  Task = mongoose.model('Tasks'),
  formidable = require('formidable'),
  fs = require('fs');

exports.send_index = function (req, res) {
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log("Someone connected from: " + ip);

  res.sendFile(path.join(global.appRoot + '/index.html'));
};

exports.send_css = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/mainStyle.css'));
}

exports.send_neural = (req, res) => {
  console.log("Sending neural js");

  res.sendFile(path.join(global.appRoot + '/workers/nnetwork.js'));
}

exports.send_worker = (req, res) => {
  res.sendFile(path.join(global.appRoot + '/workers/calc.js'));
};

exports.sendjs_index = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/index.js'));
};

exports.sendjs_functionality = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/functionality.js'));
};

exports.process_post = function (req, res) {};

exports.process_put = function (req, res) {};

exports.fileUpload = function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (err) throw err;
    var oldpath = files.fu.path;
    var newpath = 'C:/Users/lawre/Uploads/' + files.fu.name;

    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.sendFile(path.join(global.appRoot + '/index.html'));
      console.log("File should be uploaded to: " + newpath);
      
    });
  });

  /* form.parse(req, function (err, fields, files) {
    if(err) throw err;
    files.path;

    res.write('File uploaded');
    res.end();

    var oldpath = files.filetoupload.path;
    
    newpath = 'F:\Users\Lawrence\Documents\_DO\REST\Application\Uploads' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });
  }); */
};


exports.list_all_tasks = function (req, res) {
  Task.find({}, function (err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function (req, res) {
  var new_task = new Task(req.body);
  new_task.save(function (err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function (req, res) {
  Task.findById(req.params.taskId, function (err, task) {
    if (err) res.send(err);

    res.json(task);
  });
};

exports.update_a_task = function (req, res) {
  Task.findOneAndUpdate({
      _id: req.params.taskId,
    },
    req.body, {
      new: true,
    },
    function (err, task) {
      if (err) res.send(err);

      res.json(task);
      res.json({
        message: 'Tasks successfully updated',
      });
    }
  );
};

exports.delete_a_task = function (req, res) {
  Task.remove({
      _id: req.params.taskId,
    },
    function (err, task) {
      if (err) res.send(err);

      res.json({
        message: 'Task successfully deleted',
      });
    }
  );
};