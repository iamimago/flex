'use strict';
module.exports = function (app) {
  var todoList = require('../controllers/listController');

  // todoList Routes
  app
    .route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app
    .route('/')
    .get(todoList.send_index)
    .post(todoList.process_post)
    .put(todoList.process_put);

  app
    .route('/index.js')
    .get(todoList.send_js);

  app
  .route('/style.css')
  .get(todoList.send_css);
  

  app
    .route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
};