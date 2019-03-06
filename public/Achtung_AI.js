/* Main javascript file. Used for initialization of stuff.*/
'use strict';

(() => {
    let w,
        h,
        canvas,
        ctx,
        objects = [],
        entity,
        next_x,
        next_y,
        reset,
        game_mode,
        probe_x, probe_y;

    const SENSOR_ANGLE = 160,
        PLAYERS = 1,
        APPLES = 1,
        COLORS = ["red", "blue", "purple", "yellow", "orange"],
        DEBUG = 1,
        DEBUG_POS_X = [400, 2 * window.innerWidth / 8],
        DEBUG_ANGLE = [0, 180],
        MODES = {
            PLAYER: 0,
            AI: 1
        },
        STATE = {
            INACTIVE: -1,
            MOVING: 0,
            FROZEN: 1,
            DEAD: 2
        },
        DEFAULT_TAIL_LENGTH = 200,
        DEFAULT_SPEED = 1,
        DEFAULT_TURN_SPEED = 3,
        MIN_FPS = 60,
        FPS_REPORT = 1,
        FPS_REPORT_FREQUENCY = 2,
        AI_SENSORS = 1;

    entity = {
        id: -1,
        type: "none",
        STATE: STATE.INACTIVE,
        move_left: 0,
        move_right: 0,
        x: -1,
        y: -1,
        angle: -1,
        radius: -1,
        bounding_box: [],
        linear_sensors: [],
        sensor_amount: 1,
        tail: [],
        tail_curr_segment: 0,
        tail_length: -1,
        color: 'blue'
    }

    function modular_angle_addition(start, term) {
        let ret = start + term;
        if (ret > 360) {
            ret = ret % 360;
        } else if (ret < 0) {
            ret = ret + 360;
        } else if(ret == 360){
            ret = 0;
        }
        return ret;
    }

    function deg_to_rad(deg){
        return ((Math.PI)/ 180) * deg;
    }

    function pause_log() {
        console.log(objects);
        //console.log(objects[0].linear_sensors);
        alert("Paused");
    }

    function add_event_listeners() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName == 'p') {
                pause_log();
            }
            if (keyName == 'a') {
                objects[0].move_left = true;
            }
            if (keyName == 'd') {
                objects[0].move_right = true;
            }
            if (keyName == 'm') {
                //Cheat all you want
                increase_tail(objects[0], 10);
            }
            if (keyName == 'l') {
                //Used for debugging, not essential for the game, therefore very primitive.
                objects[0].tail_length -= 10;
            }
        }, false);

        document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            if (keyName == 'a') {
                objects[0].move_left = false;
            }
            if (keyName == 'd') {
                objects[0].move_right = false;
            }

        }, false);
    }

    function increase_tail(p, am) {
        let end_tail = p.tail_curr_segment;
        end_tail >= p.tail_curr_segment ? 0 : end_tail;

        let temp_tail = [];
        for (let i = 0; i < p.tail_length; i++) {
            temp_tail[i] = p.tail[(end_tail + i) % p.tail_length];
        }
        p.tail_curr_segment = p.tail_length;
        p.tail_length += am;
        p.tail = temp_tail;
    }

    function update_tail(obj) {
        //Lines from origo +- Pi/2 rads * radius, which then fills a solid in the draw funciton.
        //Only updates one segment per draw to make it more efficient, cycles through list
        obj.tail_curr_segment = obj.tail_curr_segment % obj.tail_length;
        obj.tail[obj.tail_curr_segment] = {
            x0: (Math.cos((obj.deg + 90) * (Math.PI / 180))) * obj.radius + obj.x,
            x1: (Math.cos((obj.deg - 90) * (Math.PI / 180))) * obj.radius + obj.x,
            y0: (Math.sin((obj.deg + 90) * (Math.PI / 180))) * obj.radius + obj.y,
            y1: (Math.sin((obj.deg - 90) * (Math.PI / 180))) * obj.radius + obj.y
        };
        obj.tail_curr_segment++;
    }

    function update_sensors(obj, deg) {
        let hit = 0;

        obj.linear_sensors.forEach(sensor => {
            sensor.deg += deg;
            hit = 0;

            // x = 
        });
    }

    function collision_detection(obj, next_x, next_y) {
        let oob_x = 0,
            oob_y = 0,
            hit_apple = 0,
            hit_enemy = 0;

        //Out of bounds calculations.
        if (next_x >= w - obj.radius || next_x <= 0 + obj.radius) oob_x = 1;
        if (next_y >= h - obj.radius || next_y <= 0 + obj.radius) oob_y = 1;

        if (oob_x | oob_y) obj.state = STATE.DEAD;

        if (!oob_x) obj.x = next_x;
        if (!oob_y) obj.y = next_y;

        if (hit_enemy || oob_x || oob_y) {
            obj.state = STATE.DEAD;
            return 0;
        } else {
            return 1;
        }
    }

    function logic() {
        //Object detection and movement of every object
        for (const obj of objects) {
            if (obj.state == STATE.INACTIVE) continue;
            //Flags are to determine intersections of other objects. At the moment the flags are only used to see if the object is out of bounds.
            let moved = 0,
                angle_change = 0;
            switch (obj.type) {
                case "player":
                    switch (obj.state) {
                        case STATE.MOVING:

                            //If the user has flagged to move to the left/right, increase/decrease angle.
                            if (obj.move_left) {
                                angle_change = -obj.turn_speed;
                            } else if (obj.move_right) {
                                angle_change = obj.turn_speed;
                            } else {
                                angle_change = 0;
                            }

                            obj.deg += angle_change;
                            
                            next_x = obj.x + DEFAULT_SPEED * Math.cos(deg_to_rad(obj.deg));
                            next_y = obj.y + DEFAULT_SPEED * Math.sin(deg_to_rad(obj.deg));
                            moved = collision_detection(obj, next_x, next_y);

                            //If the object has moved, draw tail.
                            if (moved) {
                                update_tail(obj);
                                update_sensors(obj, angle_change);
                            }
                            break;

                        case STATE.DEAD:
                            console.log("Trying to move DEAD object:", obj.id);
                            break;

                        default:
                            console.log("Trying to move INACTIVE player:", obj.id);
                            break;
                    }
                    break;

                case "apple":
                    switch (obj.state) {
                        case STATE.FROZEN:
                            //The apple is stationary, no logic needed.
                            break;

                        default:
                            console.log("Trying to move INACTIVE apple:", obj.id);
                            break;
                    }
                    break;

                default:
                    break;
            }
        }

        let game_over_flag = 0;
        //Check if anyone died on their move.
        for (const obj of objects) {
            if (obj.state == STATE.DEAD) {
                game_over_flag = 1;
            }
        }

        if (game_over_flag) {
            reset = 1;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const obj of objects) {
            switch (obj.type) {
                case "player":
                    ctx.fillStyle = obj.color;
                    ctx.strokeStyle = obj.color;

                    //Draw circle
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    //Draw tail
                    ctx.beginPath();

                    //Hack to adjust for increment in logic (ugly, but due to modular tail section it had to be done, also to keep draw and logic separate)
                    let start = obj.tail_curr_segment - 1;
                    let t_h_c = start; //Tail_Help_Counter, nothing else, dopehead. 

                    if (t_h_c < 0) break;

                    ctx.moveTo(obj.tail[t_h_c].x0, obj.tail[t_h_c].y0);

                    for (let i = 0; i < obj.tail_length - 1; i++) {
                        t_h_c - 1 < 0 ? t_h_c = obj.tail_length - 1 : t_h_c--;
                        if (obj.tail[t_h_c] == null) {
                            continue;
                        }
                        ctx.lineTo(obj.tail[t_h_c].x0, obj.tail[t_h_c].y0);
                    }
                    for (let i = 0; i < obj.tail_length - 1; i++) {
                        t_h_c = (t_h_c + 1) % obj.tail_length;
                        if (obj.tail[t_h_c] == null) {
                            continue;
                        }
                        ctx.lineTo(obj.tail[t_h_c].x1, obj.tail[t_h_c].y1);
                    }

                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;

                case "apple":
                    //Draw circle
                    ctx.fillStyle = obj.color;
                    ctx.strokeStyle = obj.color;
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;

                default:
                    console.log("Trying to draw INACTIVE obj:", obj);
                    break;
            }
        }
    }

    let fps_list = [], fps_report = 0, fps=0;
    function fps_counter(){
        let sum = 0, avr = 0;
        setInterval(() => {
            fps_list.push(fps);
            fps_report++;
            if(fps_report == FPS_REPORT_FREQUENCY){
                for(let i = 0; i < fps_list.length; i++){
                    sum += fps_list[i];
                }
                avr = sum / fps_report;
                console.log(`Avr fps ${FPS_REPORT_FREQUENCY} sec: ${avr}`);
                fps_report = 0;
                fps_list.length = 0;
                avr = 0;
                sum = 0;
            }
            fps = 0;
        }, 1000);
    }

    let first_run = 1, t1 = 0, t2 = 0, t3 = 0, calc_avr_list = [], calc_avr = 0;
    function step() {
        calc_avr_list.length = 0;
        t1 = performance.now();
        
        if(FPS_REPORT) fps++;

        //Hack for tail drawing system. 
        if(first_run){
            draw();
            first_run = 0;
        }
        
        logic();
        if (!reset) {
            draw();

            //Ensures 60 fps, does spare calculations as it waits for new tick. On my computer, about 3M extra computations per second can be made instead of waiting. 
            do{
                calc_avr = 0;
                t2 = performance.now();
                //START SPARE CALCUALATIONS

                //END SPARE CALCULATIONS

                //Average calculation time as a buffer to ensure close to min fps
                t3 = performance.now()
                calc_avr_list.push(t3-t2);
                for(let i = 0; i < calc_avr_list.length; i++){
                    calc_avr += calc_avr_list[i];
                }
                calc_avr = calc_avr / calc_avr_list.length;
            }while((t2 - t1) + calc_avr < 1000/MIN_FPS);
            
            window.requestAnimationFrame(step);
        }else{
            game_over();
            console.log("Game over!");
        }
    }

    function init_sensors(obj, deg) {
        let angle_segment = SENSOR_ANGLE / obj.sensor_amount,
            start_angle = modular_angle_addition(deg, -(angle_segment * Math.floor(obj.sensor_amount/2)));

        for (let i = 0; i < obj.sensor_amount; i++) {
            obj.linear_sensors[i] = {
                deg: modular_angle_addition(start_angle, angle_segment * i),
                hit_length: -1
            };
        }
    }

    function add_player(list, id, type, STATE, move_left, move_right, x, y, deg, turn_speed, color, radius, tail_length, sensor_amount) {
        let p = Object.create(entity);
        p.id = id;
        p.type = type;
        p.state = STATE;
        p.move_left = move_left;
        p.move_right = move_right;
        p.x = x;
        p.y = y;
        p.deg = deg;
        p.turn_speed = turn_speed;
        p.color = color;
        p.radius = radius;
        p.tail = [];
        p.tail_length = tail_length;
        p.sensor_amount = sensor_amount;
        p.linear_sensors = [];
        init_sensors(p, deg);
        list.push(p);
    }

    function add_static_obj(list, id, type, STATE, x, y, color, radius) {
        let p = Object.create(entity);
        p.id = id;
        p.type = type;
        p.state = STATE;
        p.x = x;
        p.y = y;
        p.color = color;
        p.radius = radius;
        list.push(p);
    }

    function reset_positions() {
        let i = 0;
        for (; i < PLAYERS; i++) {
            objects[i].state = STATE.MOVING;
            objects[i].tail.length = 0;
            objects[i].tail_curr_segment = 0;
            objects[i].tail_length = DEFAULT_TAIL_LENGTH;
            if (DEBUG) {
                objects[i].x = DEBUG_POS_X[i];
                objects[i].deg = DEBUG_ANGLE[i];
            } else {
                objects[i].x = Math.random() * w;
                objects[i].y = Math.random() * h;
            }
        }

        let n = i + APPLES;
        for (; i < n; i++) {
            objects[i].x = Math.random() * w;
            objects[i].y = Math.random() * h;
        }
    }

    function end_screen() {
        //TODO
    }

    function post_processing_ai() {
        //TODO
    }

    function game_over() {
        if (game_mode = MODES.PLAYER) {
            end_screen();
        } else if (game_mode = MODES.AI) {
            post_processing_ai();
            restart_game();
        } else {
            console.log("game_mode error in game_over");
        }
    }

    function start_game() {
        window.requestAnimationFrame(step);
    }

    function restart_game(){
        reset_positions();
        reset = 0;
        window.requestAnimationFrame(step);
    }

    function init_tensorflow() {
        // Define a model for linear regression.
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: 1,
            inputShape: [1]
        }));

        // Prepare the model for training: Specify the loss and the optimizer.
        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });

        // Generate some synthetic data for training.
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

        // Train the model using the data.
        model.fit(xs, ys, {
            epochs: 10
        }).then(() => {
            // Use the model to do inference on a data point the model hasn't seen before:
            // Open the browser devtools to see the output
            model.predict(tf.tensor2d([5], [1, 1])).print();
        });
    }
    
    function init_game(players, apples) {
        let id = 0;
        for (let i = 0; i < players; i++) {
            if (DEBUG) {
                add_player(objects, id, "player", STATE.MOVING, 0, 0, DEBUG_POS_X[i], h / 2, DEBUG_ANGLE[i] + 0, DEFAULT_TURN_SPEED, COLORS[i], 10, DEFAULT_TAIL_LENGTH, AI_SENSORS);
            } else {
                add_player(objects, id, "player", STATE.MOVING, 0, 0, Math.random() * w, Math.random() * h, Math.random() * 360, DEFAULT_TURN_SPEED, colors[i], 10, DEFAULT_TAIL_LENGTH);
            }
            id++;
        }

        for (let i = 0; i < apples; i++) {
            if (DEBUG) {
                add_static_obj(objects, id, "apple", STATE.FROZEN, 530, h / 2, "green", 5);
            } else {
                add_static_obj(objects, id, "apple", STATE.FROZEN, Math.random() * w, Math.random * h, "green", 5);
            }
            id++;
        }

        start_game();
    }

    function init() {
        w = window.innerWidth;
        h = window.innerHeight;

        game_mode = MODES.AI;

        canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');

        console.log("-- Start --");
        document.getElementsByClassName('background-container')[0].appendChild(canvas);
        add_event_listeners();

        if(FPS_REPORT) fps_counter();

        //init_tensorflow();
        init_game(PLAYERS, APPLES);
    }

    init();
})();