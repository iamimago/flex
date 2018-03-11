'use strict';

var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  Task = mongoose.model('Tasks');

exports.send_index = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log("Someone connected from: " + ip);
  
  
  res.sendFile(path.join(global.appRoot + '/index.html'));
};

exports.send_js = function(req, res){
  res.sendFile(path.join(global.appRoot + '/index.js'));
};

exports.process_post = function(req, res) {
};

exports.process_put = function(req,res){
  console.log(req);
}

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err) res.send(err);

    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
    },
    req.body,
    {
      new: true,
    },
    function(err, task) {
      if (err) res.send(err);

      res.json(task);
      res.json({
        message: 'Tasks successfully updated',
      });
    }
  );
};

exports.delete_a_task = function(req, res) {
  Task.remove(
    {
      _id: req.params.taskId,
    },
    function(err, task) {
      if (err) res.send(err);

      res.json({
        message: 'Task successfully deleted',
      });
    }
  );
};
