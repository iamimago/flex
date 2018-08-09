(() => {
    /* PROBLEMS:
                1. Allicating two pixels at the same pixel. Pointless.
                2. Optimize by calculating where individual objects will be, assign pixels thereafter... or something.
                3. Current bugs are quite pointless, caused by creating too many objects. Possible to dodge the entire bug with making it game only. I think.
    
    
    TODO:    
                1. Implement Circles.
                2. Moving circles in constant speeds
                3. Moving circles in varrying speeds
                ?x?. Collision detection between trail and circles
                4. Trail behind circle (permanent or no)
                5. Partial trail behind circle
                ?x?. Collision detection between trail and circles
                */

    const c = document.createElement("canvas"),
        canvas_width = window.innerWidth,
        canvas_height = innerHeight
        MAX_PIXELS = canvas_height * canvas_width;

    let ctx,
        particle,
        cube,
        circle,
        list = [],
        objects = [],
        pix_count = 0,
        p;

    particle = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        c_r: 0,
        c_g: 0,
        c_b: 0
    }

    cube = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        geometry: [],
        color: "FFFFFF",
        type: "cube",
        memory_locations: {}
    }

    circle = {
        x: 0,
        y: 0,
        radius: 0,
        segments: 0,
        geometry: [],
        color: "FFFFFF",
        type: "circle",
        memory_locations: {}
    }

    function update_geometry(obj) {

        switch (obj.type) {
            case "cube":
                obj.geometry = [{
                        x: obj.x,
                        y: obj.y,
                        dx: obj.x + obj.width,
                        dy: obj.y
                    },
                    {
                        x: obj.x + obj.width,
                        y: obj.y,
                        dx: obj.x + obj.width,
                        dy: obj.y + obj.width
                    },
                    {
                        x: obj.x + obj.width,
                        y: obj.y + obj.width,
                        dx: obj.x,
                        dy: obj.y + obj.width
                    },
                    {
                        x: obj.x,
                        y: obj.y + obj.width,
                        dx: obj.x,
                        dy: obj.y
                    }
                ];

                break;

            case "circle":
                obj.geography = [{

                }]

            default:
                break;
        }
    }
    let num_cubes_x = 20, num_cubes_y = 20;

    function init() {
        ctx = c.getContext('2d');
        c.width = canvas_width;
        c.height = canvas_height;
        document.getElementsByClassName("background-container")[0].appendChild(c);

        list = [];
        pix_count = 0;

        for (let i1 = 0; i1 < num_cubes_x; i1++) {
            for(let i2 = 0; i2 < num_cubes_y; i2++){
                let cube_obj = createCube(100 + 10 * i1, 100 + 10 * i2, 100, 200, "FF00FF");
                if(cube_obj < 0){
                    break;
                }else{
                    objects.push(cube_obj);
                }
            }
        }

        console.log(objects);
        
        step();
        fpsCounter();
    }

    let offset = 0;

    function animate() {

        for(let i = 0; i < objects.length; i++){
            moveCube(Math.sin(offset) * 2, Math.cos(-offset) * 2, objects[i]);
        }

        offset += 0.01;
    }

    function createCube(x, y, width, height, color){

        let c = Object.create(cube);
        c.x = x;
        c.y = y; 
        c.width = width;
        c.height = height;
        c.color = color;
        update_geometry(c);
        c.memory_locations = initSolid(c.geometry, c.color);

        if(c.memory_locations == {}){
            console.log("There was an error creating cube");
            return -1
        }else{
            return c;
        }

    }

    let temp_x, temp_y, dif_y, dif_x;
    function moveCube(x, y, obj) {
        temp_x = obj.x;
        temp_y = obj.y;

        if ((obj.x + x) + obj.width < window.innerWidth && (obj.x + x) > 0) {
            obj.x += x;
        }

        if ((obj.y + y) + obj.height < window.innerHeight && (obj.y + y) > 0) {
            obj.y += y;
        }

        dif_x = Math.round(obj.x) - Math.round(temp_x);
        dif_y = Math.round(obj.y) - Math.round(temp_y);

        if (Math.round(obj.x) != Math.round(temp_x) || Math.round(obj.y) != Math.round(temp_y)) {
            for (let i = obj.memory_locations.start_p_solid; i < obj.memory_locations.end_p_solid; i++) {
                list[i].x += dif_x;
                list[i].y += dif_y;
            }
        }
    }

    let fpsc = 0;
    function fpsCounter() {
        console.log("Fps: %i, pix_count: %i", fpsc, pix_count);
        fpsc = 0;
        setTimeout(fpsCounter, 1000);
    }


    function initCircle(midpoint, radius, segments, rgb){
        let geography = [];
        if(segments < 3){
            console.log("Too few points to initiate draw circle");
        }

        for(let i = 0; i < segments; i++){

        }
    }

    let d_line_start, d_line_end, d_line_y, start_p_solid, end_p_solid;
    function initSolid(points, rgb) {
        if (points.length < 3) {
            console.log("Too few points to draw a solid");
            return;
        }
        let y_fill_list = [],
            am_p, x_length, y_length, temp, start_p, found, step_x, step_y;

        //For each points[i] (which is a line), calculate diagonal of x -> dx, y -> dy. Save the diagonal in an array consisting of all diagonals
        //Calculate for each row y, the points x_min, x_max, draw a line between x_min->x_max. Fill the shape iteratively. 
        //Only concave shapes supported. 
        for (let i = 0; i < points.length; i++) {
            x = points[i].x;
            y = points[i].y;
            dx = points[i].dx;
            dy = points[i].dy;

            //Ensure vectors are allways S, obj or SE.
            if (x > dx) {
                temp = dx;
                dx = x;
                x = temp;
            }

            if (y > dy) {
                temp = dy;
                dy = y;
                y = temp;
            }

            x_length = dx - x;
            y_length = dy - y;

            //Pythagoras theorem
            am_p = Math.sqrt(Math.pow(x_length, 2) + Math.pow(y_length, 2));

            for (let step = 0; step < am_p; step++) {                
                found = 0;
                step_x = x + Math.floor((x_length / am_p) * step);
                step_y = y + Math.floor((y_length / am_p) * step);

                //For each y coordinate, automatically fill in what x coordinates which should be filled in in the line.
                for (let i2 = 0; i2 < y_fill_list.length; i2++) {

                    if (y_fill_list[i2].y == step_y) {
                        //This y line has been registered before.
                        found = 1;

                        //This new x is further to the left than previous one, assign new start point
                        if (step_x < y_fill_list[i2].start_p) y_fill_list[i2].start_p = step_x;

                        //This new x is further to the right than previous one, assign new end point
                        if (step_x > y_fill_list[i2].end_p) y_fill_list[i2].end_p = step_x;

                    }
                }

                if (!found) {
                    y_fill_list.push({
                        y: step_y,
                        start_p: step_x,
                        end_p: step_x
                    });
                }

            }
        }

        //Hack to get the first availible pixel
        start_p_solid = malloc_p(0);

        if(start_p_solid == -1){
            console.log("Error mallocing pixels, breaking");
            return;            
        }
        
        for (let i = 0; i < y_fill_list.length; i++) {
            d_line_start = y_fill_list[i].start_p;
            d_line_end = y_fill_list[i].end_p;
            d_line_y = y_fill_list[i].y;

            //Compare start and new end points from last move, 
            end_p_solid = drawLine(d_line_start, d_line_end, d_line_y, d_line_y, rgb, 1);
        }

        return {
            start_p_solid: start_p_solid,
            end_p_solid: end_p_solid
        }
    }

    function drawLine(x, dx, y, dy, rgb, conc) {
        let c_r, c_g, c_b, x_length, y_length, step_x, step_y, am_p;
        //Colors in hex format, parse out and convert.
        c_r = parseInt(rgb.substring(0, 2), 16);
        c_g = parseInt(rgb.substring(2, 4), 16);
        c_b = parseInt(rgb.substring(4, 6), 16);

        //Pythagoras theorem to calculate amount of pixels needed to draw line in 1:1 pixel ratio
        hyp_distance = Math.floor(Math.sqrt(Math.pow(dx - x, 2) + Math.pow(dy - y, 2)));
        //Add concentration factor
        hyp_distance *= conc;

        pix_i = malloc_p(hyp_distance);

        if(pix_i == -1){
            console.log("Error mallocing pixels, breaking");
            return;            
        }

        x_length = dx - x;
        y_length = dy - y;

        //Pythagoras theorem
        am_p = Math.sqrt(Math.pow(x_length, 2) + Math.pow(y_length, 2));

        for (let step = 0; step < am_p; step++) {

            step_x = x + Math.floor((x_length / am_p) * step);
            step_y = y + Math.floor((y_length / am_p) * step);

            list[pix_i + step].x = step_x;
            list[pix_i + step].y = step_y;
            list[pix_i + step].c_r = c_r;
            list[pix_i + step].c_g = c_g;
            list[pix_i + step].c_b = c_b;
        }

        return (pix_i + am_p);
    }

    //TODO: Garbage collection and reusability of pixels. Future problem of the engine. 
    function malloc_p(amount) {
        let start_p = pix_count;
        let end = (pix_count + amount);
        if(pix_count > MAX_PIXELS){
            console.log("Max pixels: %i, reached, cannot allocate more.", MAX_PIXELS);
            return -1;
        }

        for (; pix_count < end; pix_count++) {
            if(pix_count > MAX_PIXELS){
                console.log("Max pixels reached, cannot allocate more.");
                return -1;
            }
            p = Object.create(particle);
            list[pix_count] = p;
        }
        return start_p;
    }

    /**
     * Renders the pixels onto a image, appends image to ctx. 
     */
    function render() {
        let a, b;

        //Create image data using the width and height of the canvas
        b = (a = ctx.createImageData(canvas_width, canvas_height)).data;

        for (let i = 0; i < pix_count; i++) {

            p = list[i];
            //b is the array of pixels added to the screen. The data is ordered row per row starting top left, b[n - (n+2)] is rgb values, b[n+3] opacity.

            /* 
                System works as following. Starting top right. y * x = pixel in list. If canvas_width = 1000, and I want to draw (x,y) = (10, 2), then the pixel is list[(1000*y + x)*4] = list[(2010)*4].
                
                It's * 4 because of every pixel having 4 values for rgb and opacity.  
            */
            n = (~~p.x + (~~p.y * canvas_width)) * 4;
            b[n] = p.c_r;
            b[n + 1] = p.c_g;
            b[n + 2] = p.c_b;
            b[n + 3] = 255;
        }

        //Put the image onto the canvas, update. Basically the draw function but simplified, and this system yields higher control and less shit code. 
        ctx.putImageData(a, 0, 0);
    }

    let tog;

    function step() {
        //Animate pixels
        if (tog = !tog) {
            fpsc++;
            render();
        } else {
            animate();
        }
        requestAnimationFrame(step);
    }

    init();
})();