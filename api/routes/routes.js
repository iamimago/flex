'use strict';
module.exports = function (app) {
  var taskList = require('../controllers/controller.js');

  // todoList Routes
  app
    .route('/tasks')
    .get(taskList.list_all_tasks)
    .post(taskList.create_a_task);

  app
    .route('/')
    .get(taskList.send_index)
    .post(taskList.process_post)
    .put(taskList.process_put);

  app
    .route('/index.js')
    .get(taskList.send_js);

  app
  .route('/style.css')
  .get(taskList.send_css);

  app
  .route('/neural')
  .get(taskList.send_neural);

  app
  .route('/workers/demo_workers.js')
  .get(taskList.send_worker);
  

  app
    .route('/tasks/:taskId')
    .get(taskList.read_a_task)
    .put(taskList.update_a_task)
    .delete(taskList.delete_a_task);
};