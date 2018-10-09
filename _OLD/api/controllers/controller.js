'use strict';

var mongoose = require('mongoose'),
  path = require('path');

exports.send_index = function (req, res) {
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log("Someone connected from: " + ip + " - sending index.html");

  res.sendFile(path.join(global.appRoot + '/index.html'));
}

exports.send_css = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/mainStyle.css'));
}

exports.send_neural = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/workers/nnetwork.js'));
}

exports.send_worker = (req, res) => {
  res.sendFile(path.join(global.appRoot + '/workers/calc.js'));
}

exports.sendjs_index = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/index.js'));
}

exports.sendjs_functionality = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/functionality.js'));
}

exports.send_AI_engine = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/nnetwork/engine.js'));
}

exports.send_bgAnim_1 = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/bgAnims/bgAnim_1.js'));
}

exports.send_bgAnim_2_rows_alt_1 = function (req, res) {
  res.sendFile(path.join(global.appRoot + '/bgAnims/bgAnim_2_rows_alt_1.js'));
}

exports.send_bganim_2_calc_wasm = function (req, res) {
  var options = {
    root: "",
    dotfiles: 'deny',
    headers: {
        'Content-Type': 'application/wasm'
    }
  };
  res.sendFile(path.join(global.appRoot + '/web-assembly/bganim_2_calc.wasm'), options, function(err){
    if(err){
      console.log(err);
    }
  });
}

exports.send_test_js = function (req, res){
  res.sendFile(path.join(global.appRoot + "/web-assembly/test.js"));
}

exports.send_test_wasm = function (req, res) {
  var options = {
    root: "",
    dotfiles: 'deny',
    headers: {
        'Content-Type': 'application/wasm'
    }
  };
  res.sendFile(path.join(global.appRoot + '/web-assembly/bganim_2_calc.wasm'), options, function(err){
    if(err){
      console.log(err);
    }
  });
}