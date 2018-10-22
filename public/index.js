/* Main javascript file. Used for initialization of stuff.*/
'use strict';

(() => {
    let logics,
        w,
        h,
        canvas,
        ctx,
        objects = [],
        entity,
        state,
        move_request;

    state = {
        inactive: -1,
        moving: 0,
        frozen: 1
    }

    entity = {
        id: -1,
        type: "none",
        state: state.inactive,
        move_left: 0,
        move_right: 0,
        x: -1,
        y: -1,
        angle: -1,
        radius: -1,
        tail: [],
        tail_curr_segment: 0,
        tail_length: -1,
        color: 'blue'
    }

    function increase_tail(p, am){
        if(p.type != "player"){
            console.log("dis aint has no tail yo, gtfo. Yeah. This is my idea of an assertion clause.");
            return 1;
        }
        let end_tail = p.tail_curr_segment;
        end_tail >= p.tail_curr_segment ? 0 : end_tail;

        let temp_tail = [];
        for(let i = 0; i < p.tail_length; i++){
            temp_tail[i] = p.tail[(end_tail + i) % p.tail_length];
        }
        p.tail_curr_segment = p.tail_length;
        p.tail_length += am;
        p.tail = temp_tail;
    }

    let next_x,
        next_y,
        b_flag_x,
        b_flag_y,
        apple_flag,
        collision_flag,
        moved,
        pixel_pointer,
        pixel_pointer_x,
        pixel_pointer_y,
        p_r,
        p_g,
        p_b,
        ctx_img_data;
    function logic() {
        ctx_img_data = (ctx.getImageData(0,0,w,h)).data;
        //Check specific area, dont retrieve entire screen you bozo. I'll fix later.
        for (const obj of objects) {
            if (obj.state == state.inactive) continue;
            //Flags are to determine intersections of other objects. At the moment the flags are only used to see if the object is out of bounds.
            b_flag_x = 0, b_flag_y = 0, apple_flag = 0, collision_flag = 0, moved = 0;
            switch (obj.type) {
                case "player":
                    switch (obj.state) {
                        case state.moving:
                            //If the user has flagged to move to the left/right, increase/decrease angle.
                            if (obj.move_left) obj.angle--;
                            if (obj.move_right) obj.angle++;

                            //Always calculate the next x/y position. The position is the origo of the circle.
                            next_x = obj.x + Math.cos(obj.angle * (Math.PI / 180));
                            next_y = obj.y + Math.sin(obj.angle * (Math.PI / 180));

                            for(let i = 0; i < ~~(Math.PI * obj.radius); i++){
                                pixel_pointer_x = obj.x + (Math.cos((i + obj.angle - 45) * (Math.PI/180)) * obj.radius);
                                pixel_pointer_y = obj.y + (Math.sin((i + obj.angle - 45) * (Math.PI/180)) * obj.radius);
                                
                                pixel_pointer = (~~pixel_pointer_x + (~~pixel_pointer_y * w) * 4);
                                p_r = ctx_img_data[pixel_pointer];
                                p_g = ctx_img_data[pixel_pointer + 1];
                                p_b = ctx_img_data[pixel_pointer + 2];
                                if(p_r != 0 || p_g != 0 || p_b != 0){
                                    console.log("Hit!", {p_r, p_g, p_b});
                                }
                            }
                            
                            console.log({ctx_img_data, pixel_pointer, pixel_pointer_x, pixel_pointer_y, p_r, p_g, p_b}, "Obj x:y", obj.x, obj.y);
                            alert("no lag plz");

                            //Out of bounds calculations.
                            if (next_x >= w - obj.radius || next_x <= 0 + obj.radius) b_flag_x = 1;
                            if (next_y >= h - obj.radius || next_y <= 0 + obj.radius) b_flag_y = 1;

                            if(b_flag_x | b_flag_y | collision_flag){
                                moved = 0;
                            }

                            if(!b_flag_x){moved = 1; obj.x = next_x}
                            if(!b_flag_y){moved = 1; obj.y = next_y}

                            //If the object has moved, draw tail.
                            if (moved) {
                                //Lines from origo +- Pi/2 rads * radius, which then fills a solid in the draw funciton.
                                //Only updates one segment per draw to make it more efficient, cycles through list
                                obj.tail_curr_segment = obj.tail_curr_segment % obj.tail_length;
                                obj.tail[obj.tail_curr_segment] = {
                                    x0: (Math.cos((obj.angle + 90) * (Math.PI / 180))) * obj.radius + obj.x,
                                    x1: (Math.cos((obj.angle - 90) * (Math.PI / 180))) * obj.radius + obj.x,
                                    y0: (Math.sin((obj.angle + 90) * (Math.PI / 180))) * obj.radius + obj.y,
                                    y1: (Math.sin((obj.angle - 90) * (Math.PI / 180))) * obj.radius + obj.y
                                };
                                obj.tail_curr_segment++;
                            }
                            break;

                        default:
                            console.log("Trying to move inactive obj:", obj);
                            break;
                    }
                    break;

                case "apple":
                    switch (obj.state) {
                        case state.frozen:
                            //The apple is stationary, no logic needed.
                            break;
                    
                        default:
                            console.log("Trying to move inactive obj:", obj);
                            break;
                    }
                    break;

                default:
                    break;
            }
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

                    //Hack to adjust for increment in logic (ugly)
                    let start = obj.tail_curr_segment -1;
                    let count_thing = start;

                    ctx.moveTo(obj.tail[count_thing].x0, obj.tail[count_thing].y0);
                    
                    for (let i = 0; i < obj.tail_length - 1; i++) {               
                        count_thing - 1 < 0 ? count_thing = obj.tail_length - 1: count_thing--;
                        if (obj.tail[count_thing] == null) {
                            continue;
                        }
                        ctx.lineTo(obj.tail[count_thing].x0, obj.tail[count_thing].y0);
                    }
                    for (let i = 0; i < obj.tail_length -1; i++) {
                        count_thing = (count_thing + 1) % obj.tail_length;
                        if(obj.tail[count_thing] == null){
                            continue;
                        }
                        ctx.lineTo(obj.tail[count_thing].x1, obj.tail[count_thing].y1);
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
                    console.log("Trying to draw inactive obj:", obj);
                    break;
            }
        }
    }

    function step() {
        logic();
        draw();
        window.requestAnimationFrame(step);
    }

    /* function load_workers(){
        logics = new Worker("workers/logics.js");
    } */

    function add_player(id, type, state, move_left, move_right, x, y, deg, color, radius, tail_length) {
        let p = Object.create(entity);
        p.id = id;
        p.type = type;
        p.state = state;
        p.move_left = move_left;
        p.move_right = move_right;
        p.x = x;
        p.y = y;
        p.angle = deg;
        p.color = color;
        p.radius = radius;
        p.tail = [];
        p.tail_length = tail_length;
        objects.push(p);
    }

    function add_static_obj(id, type, state, x, y, color, radius){
        let p = Object.create(entity);
        p.id = id;
        p.type = type;
        p.state = state;
        p.x = x;
        p.y = y;
        p.color = color;
        p.radius = radius;
        objects.push(p);
    }

    function add_event_listeners() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName == 'p') {
                alert('Paused script')
            }
            if (keyName == 'a') {
                objects[0].move_left = true;
            }
            if (keyName == 'd') {
                objects[0].move_right = true;
            }
            if (keyName == 'm') {
                increase_tail(objects[0],10);
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

    function init() {
        /* if (typeof(Worker) !== "undefined") {
            load_workers();
        } else {
            console.log("Web worker not supported. Loading alternative background:");
            //TODO: Load alternative background.
        } */

        w = window.innerWidth;
        h = window.innerHeight;

        canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');

        console.log("-- Start --");
        document.getElementsByClassName('background-container')[0].appendChild(canvas);
        add_player(0, "player", state.moving, 0, 0, w/2, h/2, 0, "#b53229", 10, 20);
        add_static_obj(1, "apple", state.frozen, 796, 482, "#00FF00", 200);
        
        /* add_player(1, "player", state.moving, 0, 0, w/2, h/2, 45 ,"#4562b7", 10, 500);
        add_player(2, "player", state.moving, 0, 0, w/2, h/2, 90 ,"#4562b7", 10, 500);
        add_player(3, "player", state.moving, 0, 0, w/2, h/2, 135 ,"#4562b7", 10, 500);
        add_player(4, "player", state.moving, 0, 0, w/2, h/2, 180 ,"#4562b7", 10, 500);
        add_player(4, "player", state.moving, 0, 0, w/2, h/2, -45 ,"#4562b7", 10, 500);
        add_player(4, "player", state.moving, 0, 0, w/2, h/2, -90 ,"#4562b7", 10, 500);
        add_player(4, "player", state.moving, 0, 0, w/2, h/2, -135 ,"#4562b7", 10, 500); */

        add_event_listeners();

        step();
    }

    init();
})();