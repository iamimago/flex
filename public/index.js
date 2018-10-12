/* Main javascript file. Used for initialization of stuff.*/
(() => {
    let logics,
        w,
        h,
        canvas,
        ctx,
        objects = [],
        entity,
        state;

    state = {
        inactive: -1,
        moving: 0,
        frozen: 1
    }    
    
    entity = {
        id: -1,
        type: "none",
        state: state.inactive,
        x: -1,
        y: -1,
        angle: -1,
        radius: -1,
        tail_length: -1,
        color: 'blue'
    }
    function step(){
        //logic();
        draw();
        window.requestAnimationFrame(step);
    }

    function logic(){
        for (const obj of objects) {
            if(obj.state == state.inactive) continue;
            switch (obj.type) {
                case "player":
                    //PI * 1 rad = 180 degrees -> ((PI * 1 rad) / 180) * x = 1 degree * x   -> 1 rad = (180 degrees / PI)
                    switch (obj.state) {
                        case state.moving:
                            obj.x += Math.cos(obj.angle * (Math.PI/180));
                            obj.y += Math.sin(obj.angle * (Math.PI/180));
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
        for (const obj of objects) {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = obj.color;
            
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    
    function load_workers(){
        logics = new Worker("workers/logics.js");
    }

    function add_entity(id, type, state,  x, y, deg, color, radius, tail_length){
        let p = Object.create(entity);
        p = {id, type, state, x, y, deg, color, radius, tail_length};
        objects.push(p);
    }

    function init(){
        if (typeof(Worker) !== "undefined") {
            load_workers();
        } else {
            console.log("Web worker not supported. Loading alternative background:");
            //TODO: Load alternative background.
        }
        w = window.innerWidth;
        h = window.innerHeight;

        canvas = document.createElement("canvas");
        canvas.width     = w;
        canvas.height    = h;
        ctx = canvas.getContext('2d');

        document.getElementsByClassName('background-container')[0].appendChild(canvas);
        add_entity(0, "player", state.moving, w/2, h/2 - 100, 90, "red", 10, 0);
        add_entity(1, "player", state.moving, w/2, h/2 + 100, 270,"green", 10, 0);

        step();
    }

    init();
})();