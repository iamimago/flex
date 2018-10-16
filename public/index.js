/* Main javascript file. Used for initialization of stuff.*/

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
    function step(){
        logic();
        draw();
        window.requestAnimationFrame(step);
    }

    function logic(){
        let next_x, next_y, b_flag_x, b_flag_y, moved;
        for (const obj of objects) {            
            if(obj.state == state.inactive) continue;
            //Flags are to determine intersections of other objects. At the moment the flags are only used to see if the object is out of bounds.
            b_flag_x = 0, b_flag_y = 0, moved = 0;
            switch (obj.type) {
                case "player":
                    switch (obj.state) {
                        case state.moving:

                            //If the user has flagged to move to the left/right, increase/decrease angle.
                            if(obj.move_left) obj.angle--;
                            if(obj.move_right) obj.angle++;

                            //Always calculate the next x/y position. The position is the origo of the circle.
                            next_x = obj.x + -1 * Math.cos(obj.angle * (Math.PI/180));
                            next_y = obj.y + -1 * Math.sin(obj.angle * (Math.PI/180));

                            //Out of bounds calculations.
                            if(next_x >= w - obj.radius || next_x <= 0 + obj.radius) b_flag_x = 1;
                            if(next_y >= h - obj.radius || next_y <= 0 + obj.radius) b_flag_y = 1;

                            if(!b_flag_x) obj.x = next_x;
                            if(!b_flag_y) obj.y = next_y;

                            moved = !b_flag_x | !b_flag_y;

                            //If the object has moved, draw tail.
                            if(moved){
                                
                                // The tail is at the moment a line with a starting coordinate 90 degrees from the direction of the circle (angle) * radius, and the finishing point at -90 degrees * radius from origo.
                                // Since the line should be updated like in a "snake" game, it continiously cycles through. 
                                obj.tail[obj.tail_curr_segment] = {
                                    x0: (-1 * Math.cos((obj.angle + 90) * (Math.PI/180))) * obj.radius + obj.x,
                                    x1: (-1 * Math.cos((obj.angle - 90) * (Math.PI/180))) * obj.radius + obj.x,
                                    y0: (-1 * Math.sin((obj.angle + 90) * (Math.PI/180))) * obj.radius + obj.y,
                                    y1: (-1 * Math.sin((obj.angle - 90) * (Math.PI/180))) * obj.radius + obj.y
                                };
                                obj.tail_curr_segment >= obj.tail_length ? obj.tail_curr_segment = 0 : obj.tail_curr_segment++;
                                
                            }
                            break;
                    
                        default:
                            break;
                    }
                    break;

                case "apple":
                    break;
            
                default:
                    break;
            }
        }
    }

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const obj of objects) {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(obj.tail[0].x0, obj.tail[0].y0);
            for(let i = 0; i < obj.tail_length; i++){
                //If the tail segment is undefined, break (without breaking outer for loop)
                if(obj.tail[i] == null){
                    i = obj.tail_length;
                    continue;
                } 
                ctx.lineTo(obj.tail[i].x0, obj.tail[i].y0);
            }
            for(let i = obj.tail_length; i >= 0; i--){
                //If the tail segment is undefined, break (without breaking outer for loop)
                if(obj.tail[i] == null){
                    continue;
                } 
                ctx.lineTo(obj.tail[i].x1, obj.tail[i].y1);
            }
            ctx.closePath();
            ctx.fillStyle = obj.color;
            ctx.strokeStyle = obj.color;
            ctx.fill();
            ctx.stroke();
        }
    }
    
    /* function load_workers(){
        logics = new Worker("workers/logics.js");
    } */

    function add_entity(id, type, state, move_left, move_right, x, y, deg, color, radius, tail_length){
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

    function add_event_listeners(){
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

    function init(){
        /* if (typeof(Worker) !== "undefined") {
            load_workers();
        } else {
            console.log("Web worker not supported. Loading alternative background:");
            //TODO: Load alternative background.
        } */

        w = window.innerWidth;
        h = window.innerHeight;

        canvas = document.createElement("canvas");
        canvas.width     = w;
        canvas.height    = h;
        ctx = canvas.getContext('2d');

        document.getElementsByClassName('background-container')[0].appendChild(canvas);
        add_entity(0, "player", state.moving, 0, 0, w/2, h/2 - 100, 45, "#b53229", 10, 1000);
        //add_entity(1, "player", state.moving, 0, 0, w/2, h/2 + 100, 135 ,"#4562b7", 10, 10);
         
        add_event_listeners();

        step();
    }

    init();
})();