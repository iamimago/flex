(() => {
    //TODO: Remake 100k particle grid with sin waveish movement.

    let ctx, particle, list = [],
        man;

    const c = document.createElement("canvas"),
        w = window.innerWidth,
        h = innerHeight;

    particle = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    }

    const NUM_X = 80,
        NUM_Y = 200;
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

        //Initiate all the pixels in the image data
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
        tog;

    function animate() {
        for (let i = 0; i < NUM_PARTICLES; i++) {
            p = list[i];
            p.y += Math.sin(i + offset) * 10;
        }
        offset += 0.01;

    }

    let fpsc = 0;

    function fpsCounter() {
        console.log("Fps: " + fpsc);
        fpsc = 0;
        setTimeout(fpsCounter, 1000);
    }
    let posx, posy, a, b;

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