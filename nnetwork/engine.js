(() => {
    const c = document.createElement("canvas"),
        canvas_width = window.innerWidth,
        canvas_height = innerHeight;

    function init() {
        ctx = c.getContext('2d');
        c.width = canvas_width;
        c.height = canvas_height;
        document.getElementsByClassName("background-container")[0].appendChild(c);

        step();
        fpsCounter();
    }
    function animate() {

    }

    let fpsc = 0;
    function fpsCounter() {
        console.log("Fps: %i", fpsc);
        fpsc = 0;
        setTimeout(fpsCounter, 1000);
    }


    function draw() {
    }

    let tog;

    function step() {
        fpsc++;
        animate();
        draw();
        requestAnimationFrame(step);
    }

    init();
})();