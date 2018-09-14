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

        step();
        fpsCounter();
    }
    let offset = 0,
        tog,
        move_factor = 5,
        first = 0;

    function animate() {
        let bbox = document.getElementsByClassName("smenu-item"), intersect_x, move_y;

        
        if(first < 1){
            first = 1;

            console.log(bbox);
            for(let i = 0; i < bbox.length; i++){
                let b_bot = bbox[i].getBoundingClientRect().bottom,
                    b_top = bbox[i].getBoundingClientRect().top,
                    b_left = bbox[i].getBoundingClientRect().left,
                    b_right = bbox[i].getBoundingClientRect().right;
                    console.log("box: %s = bot: %s, top: %s, left: %i, right: %i", i, b_bot, b_top, b_left, b_right);
            }
        }

        for (let i = 0; i < NUM_PARTICLES; i++) {
            p = list[i];
            //next_step_y = p.y + Math.sin(i + offset) * move_factor;
            next_step_x = p.x + Math.cos(i + offset) * move_factor;
            intersect_x = false;

            for(let i = 0; i < bbox.length; i++){
                let b_bot = bbox[i].getBoundingClientRect().bottom,
                    b_top = bbox[i].getBoundingClientRect().top,
                    b_left = bbox[i].getBoundingClientRect().left,
                    b_right = bbox[i].getBoundingClientRect().right;

                //next_step_y < b_bot && next_step_y > b_top &&
                if(next_step_x < b_right && next_step_x > b_left && p.y < b_bot && p.y > b_top && !intersect_x){
                    //It is intersecting
                    if(next_step_x < p.x) next_step_x = b_right;
                    if(next_step_x > p.x) next_step_x = b_left;
                    intersect_x = true;
                }

                if(next_step_x < 0){
                    next_step_x = w;
                    intersect_x = true;
                }

                if(next_step_x > w){
                    next_step_x = 0;
                    intersect_x = true;
                }
            }

            if(!intersect_x) p.x = next_step_x;
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

    init();
})();