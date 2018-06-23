'use strict';
module.exports = function (app) {
  var taskList = require('../controllers/controller.js');

  /* - Get requests -  */

  app
    .route('/')
    .get(taskList.send_index);

  app
    .route('/i')
    .get(taskList.sendjs_index);
    
  app
  .route('/f')
  .get(taskList.sendjs_functionality);

  
  app
  .route("/t")
  .get(taskList.sendjs_three);

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
  .route('/nnetwork/engine.js')
  .get(taskList.send_AI_engine);

  app
  .route('/bgAnims/bgAnim_1.js')
  .get(taskList.send_bgAnim_1);


  /* - Post requests - */

};