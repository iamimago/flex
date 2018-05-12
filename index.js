/* Main javascript file. Used for initialization of stuff.*/
/* Global declarations */
let max = 10000000;

/* Alterable variables */
let cycle = 2000;
let offset = 0;
const mainFps = 60;
function initMenues() {
    const menuList = document.getElementsByClassName("smenu-item");

    for (let i = 0; i < menuList.length; i++) {
        const el = menuList[i];

        el.onmouseover = () => {

            if (el.dataset.toggle == 'min') {
                el.children[0].innerHTML = el.dataset.type;
                setTimeout(() => {}, 300);
            }
        };
        el.onmouseout = () => {
            if (el.dataset.toggle == 'min') {
                el.children[0].innerHTML = el.dataset.type.slice(0, 1);
            }
        };
    }
}

function initWorker() {
    if (typeof (Worker) !== "undefined") {
        console.log("---Web Worker supported---");

    } else {
        console.log("---Web Worker NOT supported---");
    }

    if (typeof (w) == "undefined") {
        var w = new Worker("/neural");
    }

    w.onmessage = function (event) {
        //TODO: Add things it does when it gets message
        console.log("Message recieved by worker %s" + event);
    };


    const msg = "Start yourself, worker!";

    w.postMessage({
        'cmd': 'start',
        'msg': msg
    });
}

function initBgAnim(amount) {
    const wH = window.innerWidth;
    for (let c = 2; c < amount + 2; c++) {
        const el = document.createElement("div");
        el.setAttribute("class", "circular-menu-" + (c - 2) + " circular-menu");

        el.style.width = wH / amount * (c - 1) - 20 + "px";
        el.style.height = wH / amount * (c - 1) - 20 + "px";
        el.style.zIndex = amount - (c - 2);
        document.getElementById("circle-wrapper").appendChild(el);
    }

    document.getElementById("circle-wrapper").style.opacity = "1";
    let fuck = document.getElementsByClassName("circular-menu")[0];
    fuck.style.transition = "all + " + (cycle/1000) + "s";
}

function initPerformance() {
    const t0 = performance.now();
    let p = 0;

    while ((performance.now() - t0) <= 200) {
        //TODO: Implement neural network test here
        
        let x, y;
        x = 0;
        //Dummy calculations
        for (let i = 0; i < 100000; i++) {
            y *= x;
            x++;
            if((performance.now() - t0) >= 200){
                i = 1000000;
            }
        }
        p++;
    }
    console.log("Performance p = " + p);
    
    p=5;
    return p;
}

function init() {
    if (window.jQuery) {
        // jQuery is loaded  
        console.log("---jQuery loaded from googleapi---");
    } else {
        // jQuery is not loaded
        console.log("---jQuery failed to load---");
    }

    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        console.log("---Storage supported---");

    } else {
        // Sorry! No Web Storage support..
        console.log("---Storage unsupported---");
    }

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        if (keyName === 'Control') {
            // do not alert when only Control key is pressed.
            return;
        }

        if (event.ctrlKey) {
            // Even though event.key is not 'Control' (i.e. 'a' is pressed),
            // event.ctrlKey may be true if Ctrl key is pressed at the time.
        } else {
            if (keyName == 'p') {
                alert('Paused script')
            }
        }
    }, false);

    const amountCircles = initPerformance();
    initMenues();
    initBgAnim(amountCircles);
}

init();

function bgAnimLoop() {
    const circles = document.getElementsByClassName("circular-menu");

    for (let i = 0; i < circles.length; i++) {
        const el = circles[i];
        el.toggle = false;


        el.toggleOn = () => {
            el.style.boxShadow = "0px 0px 100px 20px rgb(" + r + ", " + g + ", " + b + "), inset 0px 0px 100px 50px rgb(" + r  + ", " + g + ", " + b + ")";
        }

        el.toggleOff = () => {
            el.style.boxShadow = "0px 0px 0px 2px rgb(" + r  + ", " + g + ", " + b + "), inset 0px 0px 0px 2px rgb(" + r  + ", " + g + ", " + b + ")";
        }

        el.loop = () => {

            if (el.toggle) {
                el.toggleOn();
                el.toggle = false;
            } else {
                el.toggleOff();
                el.toggle = true;
            }

            const condition = false;
            if (!condition) {
                setTimeout(el.loop, cycle);
            }
        };

        setTimeout(
            () => el.loop(),
            (cycle / circles.length) * i);
    }
}

let r = 0;
let g = 85;
let b = 170;
let rt = 1;
let bt = 1;
let gt = 1;

function offsetLoop(){
    r += rt;
    g += gt;
    b += bt;

    /* if(r == 255){rt = -1}else if (r == 0){rt = 1}
    if(b == 255){bt = -1}else if (b == 0){bt = 1}
    if(g == 255){gt = -1}else if (g == 0){gt = 1} */

    rt = r == 255 ? -1 : r == 0 ? 1 : rt;
    gt = g == 255 ? -1 : g == 0 ? 1 : gt;
    bt = b == 255 ? -1 : b == 0 ? 1 : bt;
    
    setTimeout(() => {
        offsetLoop();
    }, 1000 / mainFps);
}

function mainLoop() {
    //TODO: Something..? I guess? Loop template foor now. 
    //checkPerformance();
    setTimeout(() => {
        mainLoop();
    }, 1000 / mainFps);
}

function loop() {
    bgAnimLoop();
    offsetLoop();
    mainLoop();
}

loop();

function checkPerformance(){
    const t0 = performance.now();
    let x, y;
    x = 0;
    //Dummy calculations
    for (let i = 0; i < max; i++) {
        x++;

        //Manual break before 10ms to not stall experience
        if((performance.now() - t0) > 10){
            i = max;
            console.log("Too much, breaking. Cycle = "+ cycle);
        }
    }
    console.log(performance.now()-t0);
}