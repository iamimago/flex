(() => {
    //TODO: Remake 100k particle grid with sin waveish movement.

    let ctx, particle, list = [],
        man;

    const c = document.createElement("canvas"),
        w = window.innerWidth,
        h = window.innerHeight;

    particle = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    }

    const NUM_X = 20,
        NUM_Y = 40;
        oBx = 0, oBy = 0,
        eBx = w - oBx,
        eBy = h - oBy,
        dx = eBx - oBx,
        dy = eBy - oBy,
        dxf = dx / NUM_X,
        dyf = dx / NUM_Y,
        NUM_PARTICLES = NUM_X * NUM_Y,
        count = 0,
        COLOR = 220;

    let offset = 0,
        tog,
        move_factor = 1,
        blocked_arr = [],
        menu_changed = 0;

    function animate() {

        let bbox = document.getElementsByClassName("sq_menu-item"), blocked_x, move_y;
        for (let i = 0; i < NUM_PARTICLES; i++) {
            p = list[i];
            //next_step_y = p.y + Math.sin(i + offset) * move_factor;
            next_step_x = p.x + Math.cos(offset) * move_factor;
            blocked_x = false;

            if(blocked_arr[~~next_step_x * ~~p.y] == 1){
                blocked_x = true;
            }

            if(next_step_x < 0){
                next_step_x = w;
                blocked_x = true;
            }

            if(next_step_x > w){
                next_step_x = 0;
                blocked_x = true;
            }

            if(!blocked_x) p.x = next_step_x;
        }
        offset += 0.01;

    }

    let fpsc = 0;

    function fpsCounter() {
        console.log("Fps: " + fpsc);
        fpsc = 0;
        setTimeout(fpsCounter, 1000);
    }
    let a, b;

    function step() {
        fpsc++;

        //Animate pixels
        if (tog = !tog) {

            b = (a = ctx.createImageData(w, h)).data;

            for (let i = 0; i < NUM_PARTICLES; i++) {
                p = list[i];
                b[n = (~~p.x + (~~p.y * w)) * 4] = b[n + 1] = b[n + 2] = COLOR, b[n + 3] = 255;
            }
            
            ctx.putImageData(a, 0, 0);
        }else{
            animate();
        }

        requestAnimationFrame(step);
    }

    function init() {
        ctx = c.getContext('2d');
        c.width = w;
        c.height = h;
        document.getElementsByClassName("background-container")[0].appendChild(c);

        //Initiate all the particles in the image data
        for (let ox = 0; ox < NUM_X; ox++) {
            for (let oy = 0; oy < NUM_Y; oy++) {
                p = Object.create(particle);
                p.x = ox * dxf + oBx;
                p.y = oy * dyf + oBx;
                list[count] = p;
                count++;
            }
        }

        let bbox = document.getElementsByClassName("sq_menu-item"), bounds = [];
        //Construct the blocked array used for collision detection        
        for(let i = 0; i < bbox.length; i++){            
            bounds.push({
                    b_bot: bbox[i].getBoundingClientRect().bottom,
                    b_top: bbox[i].getBoundingClientRect().top,
                    b_left: bbox[i].getBoundingClientRect().left,
                    b_right: bbox[i].getBoundingClientRect().right});
        }

        console.log(bounds);
        let set_blocked_flag = 0;
        for(let p_x = 0; p_x < w; p_x++){                
            for(let p_y = 0; p_y < h; p_y++){
                set_blocked_flag = 0;
                for(let i = 0; i < bounds.length; i++){
                    if(p_x > bounds[i].b_left && p_x < bounds[i].b_right && p_y > bounds[i].b_top && p_y <bounds[i].b_bot){
                        set_blocked_flag = 1;
                    }
                }
                if(set_blocked_flag){
                    blocked_arr.push(1);
                }else{
                    blocked_arr.push(0);       
                }          
                
            }
        }
        console.log({blocked_arr});
        
        

        //Easymode: (<script src="/web-assembly/test.js"></script> in index.html
        //Todo: Feed the blocked array into the memory of wasm and then check detection through wasm, see if it's faster.
        
        Module.onRuntimeInitialized = function() {
            console.log(Module._fib())
        }

        

        //step();
        //fpsCounter();
    }

    init();
})();