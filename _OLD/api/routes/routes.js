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

  app
    .route('/bgAnims/bgAnim_2_rows_alt_1.js')
    .get(taskList.send_bgAnim_2_rows_alt_1);

  app
    .route('/web-assembly/bganim_2_calc.wasm')
    .get(taskList.send_bganim_2_calc_wasm);

  app
    .route('/web-assembly/test.js')
    .get(taskList.send_test_js);

  app
    .route('/web-assembly/test.wasm')
    .get(taskList.send_test_wasm);


  /* - Post requests - */

};