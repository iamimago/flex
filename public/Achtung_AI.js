    /* 
        Achtung AI: A AI based snake background animaiton. 

        TODO: 
            * MAAAAAJOR cleaning. Jesus fucking christ man. 
    */

    'use strict';

    (() => {
        let w = window.innerWidth,
            h = window.innerHeight,
            ctx,
            objects = [],
            player_list = [],
            apple_list = [],
            entity,
            next_x,
            next_y,
            reset,
            score_update = 1,
            game_mode,
            agent,
            dyanmic_fps_factor = 2,
            animate = 0;

        const SENSOR_ANGLE = 160,
            PLAYERS = 1,
            APPLES = 1,
            COLORS = ["red", "blue", "purple", "yellow", "orange"],
            DEBUG = 1,
            DEBUG_VERBOSE = 0,
            DEBUG_POS_X = [w/4, 3*w/4],
            DEBUG_POS_Y = [h/4, 600],
            DEBUG_APPLE_POS_X = [w/4, 400],
            DEBUG_APPLE_POS_Y = [h/2, 500],
            DEBUG_ANGLE = [0, 180],
            SCORE_INCREMENT = 5,
            SCORE_UPDATE_TIME = 100,
            SCORE_APPLE = 500,
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
            DEFAULT_TAIL_LENGTH = 50,
            DEFAULT_SPEED = 1,
            DEFAULT_TURN_SPEED = 3,
            TARGET_FPS = 60,
            FPS_REPORT = 0,
            FPS_REPORT_FREQUENCY = 1,
            AI_SENSORS = 5,
            HITBOX_SEGMENT_SIZE = 20,
            ACTION_SIZE = 3, 
            STATE_SIZE = AI_SENSORS + 2 + 1 + 1; //AI sensors to danger + x and y + traveling degree + distance to apple

        entity = {
            id: -1,
            type: "none",
            STATE: STATE.INACTIVE,
            move_left: 0,
            move_right: 0,
            x: -1,
            y: -1,
            angle: -1,
            r: -1,
            hitbox: [],
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
            } else if (ret == 360) {
                ret = 0;
            }
            return ret;
        }

        function mod_addition(x, y, max, min) {
            let ret = x + y;

            //x || y is negative

            if (ret < min) {
                ret = max - (min - ret);

                //If result is STILL less than min, return minimum value
                if (ret < min) {
                    ret = ret < min ? min : ret;
                    console.warn(`Warning: mod_addition returning incorrect value (min value) since value is below min value after modular corrections. Min value returned: ${min}`);
                }
            }

            //x + y > max
            ret = ret >= max ? (ret - max) + min : ret;
            return ret;
        }

        function deg_to_rad(deg) {
            return ((Math.PI) / 180) * deg;
        }

        function list_contains_value(l, v){
            l.forEach(v_c => {
                if(v_c === v) return true;
            });
            return false;
        }

        function plog(print) {
            if (print === "o") {
                console.log(objects);
            } else if (print != undefined) {
                console.log(print);
            }

            alert("Paused");
        }

        function add_event_listeners() {
            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if (keyName == 'p') {
                    plog("o");
                }
                if (keyName == 'a') {
                    if(game_mode = MODES.PLAYER) objects[0].move_left = true;
                }
                if (keyName == 'd') {
                    if(game_mode = MODES.PLAYER) objects[0].move_right = true;
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

        function update_hitbox(ent){
            switch (ent.type) {
                case "player":
                    update_hitbox_player(ent);
                    break;

                case "apple":
                    ent.hitbox[0].x0 = ent.x - ent.r;
                    ent.hitbox[0].y0 = ent.y - ent.r;
                    ent.hitbox[0].x1 = ent.x + ent.r;
                    ent.hitbox[0].y1 = ent.y + ent.r;
                    break;
            
                default:
                    break;
            }
        }

        function update_hitbox_player(obj) {
            let hbox_head = [{
                    x0: obj.x + obj.r * Math.cos(deg_to_rad(obj.deg - 90)) + obj.r * Math.cos(deg_to_rad(obj.deg)),
                    y0: obj.y + obj.r * Math.sin(deg_to_rad(obj.deg - 90)) + obj.r * Math.sin(deg_to_rad(obj.deg)),
                    x1: obj.x + obj.r * Math.cos(deg_to_rad(obj.deg + 90)) + obj.r * Math.cos(deg_to_rad(obj.deg)),
                    y1: obj.y + obj.r * Math.sin(deg_to_rad(obj.deg + 90)) + obj.r * Math.sin(deg_to_rad(obj.deg))
                }],
                hbox = [],
                hbox_tail = [],
                next_s = 0,
                head_segment = obj.tail_curr_segment - 1,
                tail_segment = obj.tail_curr_segment % obj.tail.length,
                curr_s = tail_segment,
                len_s = obj.tail.length,
                amount = Math.floor(len_s / HITBOX_SEGMENT_SIZE),
                min_x = w,
                min_y = h,
                max_x = 0,
                max_y = 0;

            hbox_head.hbox_type = "head";
            hbox_head.type = "poly";
            hbox.push(hbox_head);

            if (len_s < 1 || typeof obj.tail[tail_segment] === 'undefined') return 0;

            //Update tail hitbox. 
            hbox_tail.push({
                x0: obj.tail[tail_segment].x0,
                y0: obj.tail[tail_segment].y0,
                x1: obj.tail[tail_segment].x1,
                y1: obj.tail[tail_segment].y1,
            });
            //For each segment, take both sides of the lines. Making a |   | segment where the top is curr_s and the bottom is next_s.
            for (let i = 1; i < amount; i++) {
                next_s = mod_addition(curr_s, HITBOX_SEGMENT_SIZE, obj.tail.length, 0);
                hbox_tail.push({
                    x0: obj.tail[curr_s].x0,
                    y0: obj.tail[curr_s].y0,
                    x1: obj.tail[next_s].x0,
                    y1: obj.tail[next_s].y0,
                });
                hbox_tail.push({
                    x0: obj.tail[next_s].x1,
                    y0: obj.tail[next_s].y1,
                    x1: obj.tail[curr_s].x1,
                    y1: obj.tail[curr_s].y1,
                });
                curr_s = next_s;
            }
            //Add lines up until the head to fill in the gaps. This looks slightly glitchy at times. Also crude solution to ensure that the hitbox doesn't hit itself. Precision shouldn't be an issue here at any case.
            hbox_tail.push({
                x0: obj.tail[curr_s].x0,
                y0: obj.tail[curr_s].y0,
                x1: obj.tail[mod_addition(head_segment, -5, obj.tail.length, 0)].x0,
                y1: obj.tail[mod_addition(head_segment, -5, obj.tail.length, 0)].y0,
            });

            hbox_tail.push({
                x0: obj.tail[curr_s].x1,
                y0: obj.tail[curr_s].y1,
                x1: obj.tail[mod_addition(head_segment, -5, obj.tail.length, 0)].x1,
                y1: obj.tail[mod_addition(head_segment, -5, obj.tail.length, 0)].y1,
            });

            hbox_tail.type = "poly";
            hbox_tail.hbox_type = "tail";

            hbox.push(hbox_tail);

            //Update bounding box.

            for (let i = 0; i < hbox_head.length; i++) {
                let el = hbox_head[i];
                min_x = el.x0 < min_x ? el.x0 : min_x;
                min_x = el.x1 < min_x ? el.x1 : min_x;
                max_x = el.x0 > max_x ? el.x0 : max_x;
                max_x = el.x1 > max_x ? el.x1 : max_x;

                min_y = el.y0 < min_y ? el.y0 : min_y;
                min_y = el.y1 < min_y ? el.y1 : min_y;
                max_y = el.y0 > max_y ? el.y0 : max_y;
                max_y = el.y1 > max_y ? el.y1 : max_y;
            }

            for (let i = 0; i < obj.tail.length; i++) {
                let el = obj.tail[i];
                min_x = el.x0 < min_x ? el.x0 : min_x;
                min_x = el.x1 < min_x ? el.x1 : min_x;
                max_x = el.x0 > max_x ? el.x0 : max_x;
                max_x = el.x1 > max_x ? el.x1 : max_x;

                min_y = el.y0 < min_y ? el.y0 : min_y;
                min_y = el.y1 < min_y ? el.y1 : min_y;
                max_y = el.y0 > max_y ? el.y0 : max_y;
                max_y = el.y1 > max_y ? el.y1 : max_y;
            }

            hbox.push({
                x0: min_x,
                y0: min_y,
                x1: max_x,
                y1: min_y,
                x2: max_x,
                y2: max_y,
                x3: min_x,
                y3: max_y,
                type: "box",
                hbox_type: "bounding_box"
            });

            obj.hitbox = hbox;
        }

        function update_sensors(obj, deg) {
            let hit = 0,
                dx = 0,
                dy = 0,
                hyp_1 = 0,
                hyp_2 = 0,
                s_deg = 0,
                hit_x, hit_y, t_hit = 0,
                dist_apple = ((obj.x - apple_list[0].x)**2 + (obj.y - apple_list[0].y)**2)**(1/2) - (obj.r + apple_list[0].r);

            obj.dist_to_apple = dist_apple;

            obj.linear_sensors.forEach(sensor => {
                sensor.deg = modular_angle_addition(sensor.deg, deg);
                s_deg = sensor.deg;
                hit = 0;

                if (s_deg <= 90) {
                    dx = w - obj.x;
                    dy = h - obj.y;

                    hyp_1 = dx / Math.cos(deg_to_rad(s_deg));
                    hyp_2 = dy / Math.sin(deg_to_rad(s_deg));
                    if (hyp_1 < hyp_2) {
                        hit = hyp_1;
                        hit_x = w;
                        hit_y = obj.y + hyp_1 * Math.sin(deg_to_rad(s_deg));
                    } else {
                        hit = hyp_2;
                        hit_x = obj.x + hyp_2 * Math.cos(deg_to_rad(s_deg));
                        hit_y = h;
                    }
                    hit = hyp_1 < hyp_2 ? hyp_1 : hyp_2;
                } else if (s_deg > 90 && s_deg <= 180) {
                    dx = obj.x;
                    dy = h - obj.y;

                    hyp_1 = dx / Math.sin(deg_to_rad(s_deg - 90));
                    hyp_2 = dy / Math.cos(deg_to_rad(s_deg - 90));
                    if (hyp_1 < hyp_2) {
                        hit = hyp_1;
                        hit_x = 0;
                        hit_y = obj.y + hyp_1 * Math.cos(deg_to_rad(s_deg - 90));
                    } else {
                        hit = hyp_2;
                        hit_x = obj.x - hyp_2 * Math.sin(deg_to_rad(s_deg - 90));
                        hit_y = h;
                    }
                    hit = hyp_1 < hyp_2 ? hyp_1 : hyp_2;

                } else if (s_deg > 180 && s_deg <= 270) {
                    dx = obj.x;
                    dy = obj.y;

                    hyp_1 = dx / Math.cos(deg_to_rad(s_deg - 180));
                    hyp_2 = dy / Math.sin(deg_to_rad(s_deg - 180));
                    if (hyp_1 < hyp_2) {
                        hit = hyp_1;
                        hit_x = 0;
                        hit_y = obj.y - hyp_1 * Math.sin(deg_to_rad(s_deg - 180));
                    } else {
                        hit = hyp_2;
                        hit_x = obj.x - hyp_2 * Math.cos(deg_to_rad(s_deg - 180));
                        hit_y = 0;
                    }
                    hit = hyp_1 < hyp_2 ? hyp_1 : hyp_2;

                } else if (s_deg > 270) {
                    dx = w - obj.x;
                    dy = obj.y;

                    hyp_1 = dx / Math.sin(deg_to_rad(s_deg - 270));
                    hyp_2 = dy / Math.cos(deg_to_rad(s_deg - 270));
                    if (hyp_1 < hyp_2) {
                        hit = hyp_1;
                        hit_x = w;
                        hit_y = obj.y - hyp_1 * Math.sin(deg_to_rad(s_deg - 180));
                    } else {
                        hit = hyp_2;
                        hit_x = obj.x + hyp_2 * Math.cos(deg_to_rad(s_deg));;
                        hit_y = 0;
                    }
                    hit = hyp_1 < hyp_2 ? hyp_1 : hyp_2;
                }

                let line_check = {
                        x0: obj.x,
                        y0: obj.y,
                        x1: hit_x,
                        y1: hit_y
                    },
                    ret, w_ret;

                apple_list.forEach(a => {
                    ret = line_intersects_object(a.hitbox[0], line_check);
                    if (ret) {
                        if (ret.len < hit) {
                            hit_x = ret.hit_x;
                            hit_y = ret.hit_y;
                            hit = ((obj.x - ret.hit_x) ** 2 + (obj.y - ret.hit_y) ** 2) ** (1 / 2);
                        }
                    }
                });

                let p_hit = 0;
                player_list.forEach(p => {
                    //If it doesn't hit the outer bounding box: continue. This decreases amount of potential computations significantly
                    if (line_intersects_object(p.hitbox[2], line_check) != 0) {

                        if (p.id !== obj.id) {
                            w_ret = line_intersects_object(p.hitbox[0], line_check);
                            if (w_ret != 0) {
                                p_hit = 1;
                            }
                            if (w_ret.len < hit) {
                                hit = w_ret.len;
                                hit_x = w_ret.hit_x;
                                hit_y = w_ret.hit_y;
                            }
                        } else {
                            w_ret = line_intersects_object(p.hitbox[1], line_check);
                            if (w_ret != 0) {
                                p_hit = 1;
                            }
                            if (w_ret.len < hit) {
                                hit = w_ret.len;
                                hit_x = w_ret.hit_x;
                                hit_y = w_ret.hit_y;
                            }
                        }
                    }
                });

                sensor.hit_length = hit;
                sensor.hit_x = hit_x;
                sensor.hit_y = hit_y;
            });
        }

        function update_tail(obj) {
            //Lines from origo +- Pi/2 rads * r, which then fills a solid in the draw funciton.
            //Only updates one segment per draw to make it more efficient, cycles through list
            obj.tail_curr_segment = obj.tail_curr_segment % obj.tail_length;
            obj.tail[obj.tail_curr_segment] = {
                x0: (Math.cos((obj.deg + 90) * (Math.PI / 180))) * obj.r + obj.x,
                x1: (Math.cos((obj.deg - 90) * (Math.PI / 180))) * obj.r + obj.x,
                y0: (Math.sin((obj.deg + 90) * (Math.PI / 180))) * obj.r + obj.y,
                y1: (Math.sin((obj.deg - 90) * (Math.PI / 180))) * obj.r + obj.y
            };
            obj.tail_curr_segment++;
        }

        function point_hit_bounding_box(x, y){
            objects.forEach(o => {
                let b_box = o.hitbox[0];
                switch (b_box.type) {
                    case "box_simple":
                        if(x > b_box.x0 && x < b_box.x1 && y > b_box.y0 && y < b_box.y1) return 1;                   
                        break;

                    
                    case "box":
                        if(x > b_box.x0 && x < b_box.x3 && y > b_box.y0 && y < b_box.y3) return 1;
                        break;
                
                    default:
                        break;
                }
            });

            return 0;
        }

        function random_position(ent){
            let x = w * Math.random(), y = h * Math.random();

            while(point_hit_bounding_box(x, y)){
                x = w * Math.random();
                y = h * Math.random();
            }
            ent.x = w * Math.random();
            ent.y = h * Math.random();
            update_hitbox(ent);
        }

        function player_hit_apple(p, a){
            increase_tail(p, SCORE_APPLE);
            random_position(a);
        }

        function line_intersection(x0, y0, x1, y1, x2, y2, x3, y3) {
            let s, t, Px, Py,
                s1_x = x1 - x0,
                s1_y = y1 - y0,
                s2_x = x3 - x2,
                s2_y = y3 - y2;

            s = (-s1_y * (x0 - x2) + s1_x * (y0 - y2)) / (-s2_x * s1_y + s1_x * s2_y);
            t = (s2_x * (y0 - y2) - s2_y * (x0 - x2)) / (-s2_x * s1_y + s1_x * s2_y);

            if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                Px = x0 + (t * s1_x);
                Py = y0 + (t * s1_y);
                length = ((Px - x2) ** 2 + (Py - y2) ** 2) ** (1 / 2);
                return {
                    hit_x: Px,
                    hit_y: Py,
                    len: ((Px - x2) ** 2 + (Py - y2) ** 2) ** (1 / 2)
                };
            } else {
                return 0;
            }
        }

        /* 
            Box: p_min p_max forming a square. Converts into polyline, then checks the interceptions of the polyline
            Poly: an array of lines. The function checks every line individually in the polyline object.
        */
        function line_intersects_object(obj, line) {
            let res, ret = 0,
                box_poly = [];
            if (typeof obj === "undefined" || typeof obj.type === "undefined") return ret;

            switch (obj.type) {
                case "box_simple":
                    box_poly = [{
                        x0: obj.x0,
                        y0: obj.y0,
                        x1: obj.x1,
                        y1: obj.y0
                    }, {
                        x0: obj.x1,
                        y0: obj.y0,
                        x1: obj.x1,
                        y1: obj.y1
                    }, {
                        x0: obj.x1,
                        y0: obj.y1,
                        x1: obj.x0,
                        y1: obj.y1
                    }, {
                        x0: obj.x0,
                        y0: obj.y1,
                        x1: obj.x0,
                        y1: obj.y0
                    }];


                    res = line_intersect_polygon(box_poly, line);
                    if (res != 0) {
                        if (ret == 0) {
                            ret = res;
                        } else {
                            ret = res.len < ret.len ? res : ret;
                        }
                    }
                    break;

                case "box":
                    box_poly = [{
                        x0: obj.x0,
                        y0: obj.y0,
                        x1: obj.x1,
                        y1: obj.y1
                    }, {
                        x0: obj.x1,
                        y0: obj.y1,
                        x1: obj.x2,
                        y1: obj.y2
                    }, {
                        x0: obj.x2,
                        y0: obj.y2,
                        x1: obj.x3,
                        y1: obj.y3
                    }, {
                        x0: obj.x3,
                        y0: obj.y3,
                        x1: obj.x0,
                        y1: obj.y0
                    }];


                    res = line_intersect_polygon(box_poly, line);
                    if (res != 0) {
                        if (ret == 0) {
                            ret = res;
                        } else {
                            ret = res.len < ret.len ? res : ret;
                        }
                    }
                    break;


                case "poly":
                    ret = line_intersect_polygon(obj, line);
                    break;

                default:
                    throw "Trying to check interseption of object without a type.";

                    break;
            }

            return ret;
        }

        function line_intersect_polygon(poly, line) {
            let res, ret = 0;

            if (poly.length > 0) {
                poly.forEach(p_line => {
                    res = line_intersection(p_line.x0, p_line.y0, p_line.x1, p_line.y1, line.x0, line.y0, line.x1, line.y1);

                    if (res != 0) {
                        if (ret != 0) {
                            ret = res.len < ret.len ? res : ret;
                        } else {
                            ret = res;
                        }
                    }
                });
            } else {
                let p_line = poly;

                res = line_intersection(p_line.x0, p_line.y0, p_line.x1, p_line.y1, line.x0, line.y0, line.x1, line.y1);
                if (res != 0) {
                    if (ret.len != 0) {
                        ret = res.len < ret.len ? res : ret;
                    } else {
                        ret = res;
                    }
                }
            }

            return ret;
        }

        function collision_detection(obj, next_x, next_y) {
            let oob_x = 0,
                oob_y = 0,
                hit_apple = 0,
                hit_enemy = 0;

            //Out of bounds calculations.
            if (next_x >= w - obj.r || next_x <= 0 + obj.r) oob_x = 1;
            if (next_y >= h - obj.r || next_y <= 0 + obj.r) oob_y = 1;

            if (oob_x | oob_y) obj.state = STATE.DEAD;

            if (!oob_x) obj.x = next_x;
            if (!oob_y) obj.y = next_y;

            /* 
                Check every other objects bounding box first, if the hitbox head of the player hits any other objects bounding box: continue to see if it actually hits the other object (snakes are wiggly).

                Line-line detect the 3 hitbox head lines with all the lines of the poly line tail, but only if hit bounding box.  
            */
            if (typeof obj.hitbox[0] !== "undefined") {
                let ret;

                obj.hitbox[0].forEach(head_line => {
                    objects.forEach(check_obj => {
                        switch (check_obj.type) {
                            case "player":
                                //If the head hitbox of moving object hits any other bounding box: Continue the check.
                                if (obj.id === check_obj.id) {
                                    if (ret = line_intersects_object(check_obj.hitbox[1], head_line)) {
                                        obj.state = STATE.DEAD;
                                    }
                                } else if (ret = line_intersects_object(check_obj.hitbox[2], head_line)) {
                                    if (ret = line_intersects_object(check_obj.hitbox[1], head_line)) {
                                        if (DEBUG && DEBUG_VERBOSE) console.log(`Obj: ${obj.id} hit obj: ${check_obj.id} type: ${check_obj.hitbox[1].hbox_type} at x:y -> ${ret.hit_x}:${ret.hit_y}`);
                                        
                                    }
                                }
                                break;

                            case "apple":
                                if (ret = line_intersects_object(check_obj.hitbox[0], head_line)) {
                                    player_hit_apple(obj, apple_list[check_obj.id]);
                                }
                                break;

                            default:
                                break;
                        }
                    });
                });
            }

            if (hit_enemy || oob_x || oob_y) {
                obj.state = STATE.DEAD;
                return 0;
            } else {
                return 1;
            }
        }

        function increase_tail(p, am) {
            let end_tail = p.tail_curr_segment;
            end_tail >= p.tail.length ? 0 : end_tail;

            let temp_tail = [];
            for (let i = 0; i < p.tail.length; i++) {
                temp_tail[i] = p.tail[(end_tail + i) % p.tail.length];
            }
            p.tail_curr_segment = p.tail.length;
            p.tail_length += am;
            p.tail = temp_tail;
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
                                let state = convert_state(obj), action = obj.agent.act(state), reward = SCORE_INCREMENT;
                                
                                if (action == 0) {
                                    angle_change = -obj.turn_speed;
                                } else if (action == 1) {
                                    angle_change = obj.turn_speed;
                                } else if (action == 2) {
                                    angle_change = 0;
                                }

                                obj.deg = modular_angle_addition(obj.deg, angle_change);;

                                next_x = obj.x + DEFAULT_SPEED * Math.cos(deg_to_rad(obj.deg));
                                next_y = obj.y + DEFAULT_SPEED * Math.sin(deg_to_rad(obj.deg));
                                moved = collision_detection(obj, next_x, next_y);

                                //If the object has moved, draw tail.
                                if (moved) {
                                    obj.score += SCORE_INCREMENT;
                                    update_tail(obj);
                                    update_sensors(obj, angle_change);

                                    //Hack to keep the object from intersecting itself at every start
                                    if (obj.tail.length > 5) {
                                        update_hitbox_player(obj);
                                    }
                                }else{
                                    reward = -1000;
                                }                                
                                let sv_next_state = convert_state(obj), done = !moved;

                                obj.agent.remember(state, action, reward, sv_next_state, done);
                                
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

        function draw_hitbox(ctx, hitbox_arr) {

            hitbox_arr.forEach(poly => {
                ctx.beginPath();
                switch (poly.type) {
                    case "box":
                        ctx.moveTo(poly.x0, poly.y0);
                        ctx.lineTo(poly.x1, poly.y1);
                        ctx.lineTo(poly.x2, poly.y2);
                        ctx.lineTo(poly.x3, poly.y3);
                        ctx.lineTo(poly.x0, poly.y0);
                        break;

                    case "box_simple":
                        ctx.moveTo(poly.x0, poly.y0);
                        ctx.lineTo(poly.x1, poly.y0);
                        ctx.lineTo(poly.x1, poly.y1);
                        ctx.lineTo(poly.x0, poly.y1);
                        ctx.lineTo(poly.x0, poly.y0);
                        break;

                    case "poly":
                        // Line poly: consistent of a group of lines format {x0, y0, x1, y1}
                        if (poly.length > 0) {
                            poly.forEach(p_line => {
                                ctx.moveTo(p_line.x0, p_line.y0);
                                ctx.lineTo(p_line.x1, p_line.y1);
                            });
                        }

                        break;
                    default:
                        console.log(hitbox_arr);
                        throw "Trying to draw hitbox without valid type";

                        break;
                }
                ctx.closePath();
                ctx.stroke();

            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (const obj of objects) {
                switch (obj.type) {
                    case "player":
                        //draw player draw snake
                        ctx.fillStyle = obj.color;
                        ctx.strokeStyle = obj.color;

                        //Draw circle
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, false);
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

                        //Draw debug objects
                        if (DEBUG) {
                            ctx.fillStyle = "white";
                            ctx.strokeStyle = "white";
                            obj.linear_sensors.forEach(sen => {
                                ctx.beginPath();
                                ctx.moveTo(obj.x, obj.y);
                                ctx.lineTo(sen.hit_x, sen.hit_y);
                                ctx.closePath();
                                ctx.stroke();
                            });
                            draw_hitbox(ctx, obj.hitbox);

                            ctx.fillStyle = obj.color;
                            ctx.strokeStyle = obj.color;
                        }
                        break;

                    case "apple":
                        //draw apple
                        ctx.fillStyle = obj.color;
                        ctx.strokeStyle = obj.color;
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        if (DEBUG) {
                            ctx.fillStyle = "white";
                            ctx.strokeStyle = "white";

                            draw_hitbox(ctx, obj.hitbox);

                            ctx.fillStyle = obj.color;
                            ctx.strokeStyle = obj.color;
                        }

                        break;

                    default:
                        console.log("Trying to draw INACTIVE obj:", obj);
                        break;
                }
            }
        }

        function score_updater(score, time){

            player_list.forEach(p => {
                p.score += score;
                increase_tail(p, score);
            });

            if(score_update){
                setTimeout(() => {
                    score_updater(score, time)
                }, time);
            }
        }

        let fps_list = [],
            fps_report = 0,
            fps = 0;

        function fps_counter() {
            let sum = 0,
                avr = 0;
            setInterval(() => {
                fps_list.push(fps);
                fps_report++;
                if (fps_report == FPS_REPORT_FREQUENCY) {
                    for (let i = 0; i < fps_list.length; i++) {
                        sum += fps_list[i];
                    }
                    avr = sum / fps_report;
                    console.log(`Avr fps ${FPS_REPORT_FREQUENCY} sec: ${avr}, dyanmic_fps_factor:${dyanmic_fps_factor}, spare calc runs: ${spare_calc_counter}`);
                    dyanmic_fps_factor *= TARGET_FPS/avr;
                    fps_report = 0;
                    fps_list.length = 0;
                    avr = 0;
                    sum = 0;
                    spare_calc_counter = 0;
                }
                fps = 0;
            }, 1000);
        }

        let first_run = 1,
            t1 = 0,
            t2 = 0,
            spare_calc_counter = 0;

        function step() {
            t1 = performance.now();
            if (FPS_REPORT) fps++;

            //Hack for tail drawing system. 
            if (first_run) {
                if(animate) draw();
                first_run = 0;
            }

            if (!reset) {
                logic();
                
                if(animate){ draw();
                    do {
                        spare_calc_counter++;

                        //START SPARE CALCUALATIONS                    
                        //END SPARE CALCULATIONS

                        t2 = performance.now();
                        //dynamic_fps_factor is multiplied by the ratio between the target fps and the actual fps. No matter if the actual is above or below, the actual fps will converge towards target fps. 
                        //The problem with this design is that it may take a couple of seconds before it reaches the target fps. Not sure how to optimize that. 
                    } while ((t2 - t1) + dyanmic_fps_factor < 1000 / TARGET_FPS);
                
                    window.requestAnimationFrame(step);
                }else{
                    step();
                }
            } else {
                game_over();
            }
        }

        function init_sensors(obj, deg) {
            let angle_segment = SENSOR_ANGLE / obj.sensor_amount,
                start_angle = modular_angle_addition(deg, -(angle_segment * Math.floor(obj.sensor_amount / 2)));

            for (let i = 0; i < obj.sensor_amount; i++) {
                obj.linear_sensors[i] = {
                    deg: modular_angle_addition(start_angle, angle_segment * i),
                    hit_length: -1
                };
            }
        }

        function add_player(id, type, STATE, move_left, move_right, x, y, deg, turn_speed, color, r, tail_length, sensor_amount) {
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
            p.r = r;
            p.tail = [];
            p.tail_length = tail_length;
            p.sensor_amount = sensor_amount;
            p.linear_sensors = [];
            p.hitbox = [];
            p.score = 0;
            p.agent = new DQNAgent(STATE_SIZE, ACTION_SIZE);
            init_sensors(p, deg);
            objects.push(p);
            player_list.push(p);
            return p;
        }

        function add_apple(id, type, STATE, x, y, color, r) {        
            let p = Object.create(entity);
            p.id = id;
            p.type = type;
            p.state = STATE;
            p.x = x;
            p.y = y;
            p.color = color;
            p.r = r;
            p.hitbox = [{
                x0: x - r,
                y0: y - r,
                x1: x + r,
                y1: y + r,
                type: "box_simple"
            }];
            objects.push(p);
            apple_list.push(p);
            return p;
        }

        function reset_game() {

            player_list.forEach(player => {
                player.state = STATE.MOVING;
                player.tail.length = 0;
                player.tail_curr_segment = 0;
                player.tail_length = DEFAULT_TAIL_LENGTH;
                player.hitbox.length = 0;
                player.score = 0;
                if (DEBUG) {
                    player.x = DEBUG_POS_X[player.id];
                    player.y = DEBUG_POS_Y[player.id];
                    player.deg = DEBUG_ANGLE[player.id];
                    player.linear_sensors.length = 0;
                } else {
                    player.x = Math.random() * w;
                    player.y = Math.random() * h;
                    player.deg = Math.random() * 360;
                    player.linear_sensors.length = 0;
                }
                update_hitbox_player(player);
                init_sensors(player, player.deg);
            });

            apple_list.forEach(apple => {
                apple.x = Math.random() * w;
                apple.y = Math.random() * h;
                apple.hitbox = [{
                    x0: apple.x - apple.r,
                    y0: apple.y - apple.r,
                    x1: apple.x + apple.r,
                    y1: apple.y + apple.r,
                    type: "box_simple"
                }];
            });

            score_update = 1;
        }

        function end_screen() {
            //TODO
        }

        async function post_processing_ai() {
            for(let i = 0; i < player_list.length; i++){
                await player_list[i].agent.replay();
            }
        }

        let epoch = 0;
        async function game_over() {
            score_update = 0;
            let score_report = `Epoch: ${epoch} - Scores: \n`, max_score = 0;
            player_list.forEach(p =>{
                score_report += `Player: ${p.id} scored: ${p.score}, epsilon: ${p.agent.epsilon} \n`;
                if(p.agent.epsilon < 0.2) animate = 1;
                /* if(p.score > max_score){
                    p.agent.save_model();
                    max_score = p.score;
                } */
            });
            console.log(score_report);

            

            if (game_mode = MODES.PLAYER) {
                end_screen();
            } else if (game_mode = MODES.AI) {
                await post_processing_ai().then( ()=>{
                    setTimeout(() => {
                        restart_game();
                    }, 20);
                });
            } else {
                throw "Gamemode invalid"
            }
            epoch++;
        }

        function start_game() {
            if(animate){
                window.requestAnimationFrame(step);
            }else{
                step();
            }
        }

        let reset_active = 0;

        function restart_game() {
            reset_game();
            reset = 0;
            reset_active = 1;
            score_updater(SCORE_INCREMENT, SCORE_UPDATE_TIME);
            if(animate){
                window.requestAnimationFrame(step);
            }else{
                step();
            }
        }

        function init_DOMS() {

            let canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            ctx = canvas.getContext('2d');
            document.getElementsByClassName('background-container')[0].appendChild(canvas);
        }

        function init_game(players, apples) {
            for (let i = 0; i < players; i++) {
                let p;
                if (DEBUG) {
                    p = add_player(i, "player", STATE.MOVING, 0, 0, DEBUG_POS_X[i], DEBUG_POS_Y[i], DEBUG_ANGLE[i] + 0, DEFAULT_TURN_SPEED, COLORS[i], 10, DEFAULT_TAIL_LENGTH, AI_SENSORS);
                } else {
                    p = add_player(i, "player", STATE.MOVING, 0, 0, Math.random() * w, Math.random() * h, Math.random() * 360, DEFAULT_TURN_SPEED, COLORS[i], 10, DEFAULT_TAIL_LENGTH);
                }
                //p.agent.load_model();
            }

            for (let i = 0; i < apples; i++) {
                if (DEBUG) {
                    add_apple(i, "apple", STATE.FROZEN, DEBUG_APPLE_POS_X[i], DEBUG_APPLE_POS_Y[i], "green", 5);
                } else {
                    add_apple(i, "apple", STATE.FROZEN, Math.random() * w, Math.random() * h, "green", 5);
                }
            }
            score_updater(SCORE_INCREMENT, SCORE_UPDATE_TIME);
            start_game();
        }

        function convert_state(p){
            let l_helper = [];
            l_helper.push(p.x);
            l_helper.push(p.y);
            l_helper.push(p.deg);
            l_helper.push(p.dist_to_apple);
            p.linear_sensors.forEach(s => {l_helper.push(s.hit_length);});
            return l_helper;
        }

        async function fit_model(model, x, y){                
            await model.fit(tf.tensor2d(x, [1,STATE_SIZE]), tf.tensor2d(y, [1, ACTION_SIZE]));
        }

        class DQNAgent{
            constructor(state_size, action_size){
                this.state_size = state_size;
                this.action_size = action_size;
                this.memory = [];
                this.gamma = 0.85;
                this.epsilon = 1.0;
                this.epsilon_decay = 0.995;
                this.epsilon_min = 0.01;
                this.learning_rate = 0.001;
                this.mem_max = 5000;
                this.batch_size = 32;
                this.max_result = 0;
                this.model = this.construct_model();
            }

            construct_model(){
                const model = tf.sequential({
                    layers: [
                        tf.layers.dense({
                            inputShape: [this.state_size],
                            units: 16,
                            activation: 'relu'
                        }),
                        tf.layers.dense({
                            units: 32,
                            activation: 'relu'
                        }),
                        tf.layers.dense({
                            units: this.action_size,
                            activation: 'softmax'
                        })
                    ]
                });                  

                model.compile({
                    loss: 'meanSquaredError',
                    optimizer: 'sgd',
                    metrics: ['accuracy']
                });
                return model;
            }

            async load_model(){
                 this.model = await tf.loadLayersModel('localstorage://max-model-1');
            }

            async save_model(){
                await this.model.save('localstorage://max-model-1');
            }

            remember(state, action, reward, next_state, done){
                this.memory.push({
                    state: state,
                    action: action,
                    reward: reward,
                    next_state: next_state,
                    done: done
                });
                if(this.memory.length >= this.mem_max) this.memory.shift();
            }

            act(state){
                if(Math.random() <= this.epsilon) return Math.floor(Math.random() * 3); // Potentially do random action

                let act_values = this.model.predict(tf.tensor2d(state, [1, STATE_SIZE]));                
                return tf.argMax(act_values);
            }

            random_sample(){
                if(this.memory.length < this.batch_size) return [];
                let ret_batch = [];
                for (let i = 0; i < this.batch_size; i++) {
                    let set;
                    do{
                        set = this.memory[Math.floor(Math.random() * this.memory.length -1)];
                    }while(typeof set === 'undefined');
                    ret_batch.push(this.memory[Math.floor(Math.random() * this.memory.length -1)]);
                }               
                
                return ret_batch;
            }

            async replay(){
                const minibatch = this.random_sample();

                for(let i = 0; i < minibatch.length; i++){
                    if(typeof minibatch[i] === 'undefined'){
                        //I dunno why it happends too tired to figure it out fuck it it works training for a while now.
                        continue;
                    }

                    let set = minibatch[i], target = set.reward, max = Number.MIN_VALUE;
                    
                    if(!set.done){
                        this.model.predict(tf.tensor2d(set.state, [1,STATE_SIZE]))
                        .toString().split(/\[{2}/)[1].split(/\]/)[0].split(",").
                        forEach(n => {max = parseFloat(n) > max ? parseFloat(n) : max});
                        target = set.reward + this.gamma * max; 
                    }

                    let target_f = this.model.predict(tf.tensor2d(set.state, [1,STATE_SIZE]));
                    target_f = tensor_to_array(target_f);
                    target_f[set.action] = target;

                    await fit_model(this.model, set.state, target_f);
                }
                
                if(this.epsilon > this.epsilon_min) this.epsilon *= this.epsilon_decay;
            }
        }

        function tensor_to_array(tensor){
            let arr = tensor.toString()
                .split(/\[{2}/)[1]
                .split(/\]/)[0]
                .split(",");

            for(let i = 0; i < arr.length; i++){
                arr[i] = parseFloat(arr[i]);
            }
            return arr;
        }

        function init() {
            console.log("-- Start --");
            if (FPS_REPORT) fps_counter();
        
            game_mode = MODES.AI;
            add_event_listeners();
            init_DOMS();
            init_game(PLAYERS, APPLES);          
            
        }

        init();
    })();