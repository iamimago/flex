(() => {
    let ctx,
     particle,
     particle_list = [],
     offset = 0,
     tog,
     circle_radius_factor = 2,
     blocked_arr = [],
     bounds = [];

    const c = document.createElement("canvas"),
        w = window.innerWidth,
        h = window.innerHeight,
        NUM_PARTICLES = 20000,
        COLOR = 220;

    particle = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    }
    
    function update_blocked_pixels(){
        let set_blocked_flag = 0;                
        for(let p_y = 0; p_y < h; p_y++){
            for(let p_x = 0; p_x < w; p_x++){
                set_blocked_flag = 0;
                for(let i = 0; i < bounds.length; i++){
                    if(p_x > bounds[i].b_left && p_x < bounds[i].b_right && p_y > bounds[i].b_top && p_y < bounds[i].b_bot){
                        set_blocked_flag = 1;
                        break;
                    }
                }
                if(set_blocked_flag){
                    blocked_arr[p_y * w + p_x] = 1;
                }else{
                    blocked_arr[p_y * w + p_x] = 0;
                }
            }
        }
    }

    let prev_bounds = [];
    function animate() {
        let bbox = document.getElementsByClassName("sq_menu-item"); 
        bounds = []; 
        for(let i = 0; i < bbox.length; i++){            
            bounds.push({
                    b_bot: bbox[i].getBoundingClientRect().bottom,
                    b_top: bbox[i].getBoundingClientRect().top,
                    b_left: bbox[i].getBoundingClientRect().left,
                    b_right: bbox[i].getBoundingClientRect().right});
        }

        if(bounds[1].b_bot != prev_bounds[1].b_bot){            
            update_blocked_pixels();
            
            let par_x, par_y, move_blocked = 1;
            for(let i = 0; i < NUM_PARTICLES; i++){
                par_x = particle_list[i].x;
                par_y = particle_list[i].y;
                move_blocked = 1;
    
                if(blocked_arr[~~par_y * w + ~~par_x]){                    
                    while(move_blocked){
                        par_x = ~~(Math.random() * w);
                        par_y = ~~(Math.random() * h);
                        move_blocked = blocked_arr[par_y * w + par_x];
                    }

                    particle_list[i].x = par_x;
                    particle_list[i].y = par_y;
                }
            }
        }
        prev_bounds = bounds;

        let blocked_x, blocked_y;
        for (let i = 0; i < NUM_PARTICLES; i++) {
            p = particle_list[i];
            next_step_y = p.y + Math.sin(i + offset) * circle_radius_factor;
            next_step_x = p.x + Math.cos(i + offset) * circle_radius_factor;
            blocked_x = false;
            blocked_y = false;
            
            //Item detection occurs here by checking memory after a memory map, in the form of a modolu-like array. blocked_arr[38 * w + 50] = coordinate (38,50). Easy way of not having to use a two dimensional array.
            if(blocked_arr[w * ~~p.y + ~~next_step_x]) blocked_x = true;
            if(blocked_arr[w * ~~next_step_y + ~~p.x]) blocked_y = true;

            if(next_step_x < 0) blocked_x = true;
            if(next_step_y < 0) blocked_y = true;
 
            if(next_step_x > w) blocked_x = true;
            if(next_step_y > h) blocked_y = true;

            if(!blocked_x) p.x = next_step_x;
            if(!blocked_y) p.y = next_step_y;
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
                p = particle_list[i];
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

        let bbox = document.getElementsByClassName("sq_menu-item");
        //Construct the blocked array used for collision detection        
        for(let i = 0; i < bbox.length; i++){            
            bounds.push({
                    b_bot: bbox[i].getBoundingClientRect().bottom,
                    b_top: bbox[i].getBoundingClientRect().top,
                    b_left: bbox[i].getBoundingClientRect().left,
                    b_right: bbox[i].getBoundingClientRect().right});
        }
        prev_bounds = bounds;

        update_blocked_pixels();
        
        let spawn_blocked = 1;
        //Initiate all the particles in the image data
        for (let i = 0; i < NUM_PARTICLES; i++) {
            spawn_blocked = 1;
            p = Object.create(particle);
            while(spawn_blocked){
                p.x = ~~(Math.random() * w);
                p.y = ~~(Math.random() * h);
                spawn_blocked = blocked_arr[p.y * w + p.x];
            }
            particle_list[i] = p;
        }

        step();
        fpsCounter();
    }

    init();
})();