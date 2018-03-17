if (window.jQuery) {
    // jQuery is loaded  
    console.log("---jQuery loaded from googleapi---");
} else {
    // jQuery is not loaded
    console.log("---jQuery failed to load---");
}

let oSpeedOuter = 200;
let oSpeedInner = 200;
let oSpeedInner2 = 50;
let oDistanceInner = 300;

function initiateDots(parent, amount, row) {
    for (let c = 0; c < amount; c++) {
        let el = document.createElement("div");
        el.setAttribute("class", "circular-menu-item-" + row + " circular-menu-item");
        parent.appendChild(el);
    }
}

function createMenus(amount) {
    let wH = window.innerHeight;
    for (let c = 2; c < amount + 2; c++) {
        let el = document.createElement("div");
        el.setAttribute("class", "circular-menu-" + (c - 2) + " circular-menu");

        el.style.width = wH / amount * (c - 1) - 20 + "px";
        el.style.height = wH / amount * (c - 1) - 20 + "px";
        el.style.zIndex = amount - (c - 2);
        document.getElementById("circle-wrapper").appendChild(el);
    }
}

let pos = 0;
let neg = 0;
let before, w, items, circleEdge, cB, e, radius, xPos, yPos;
let circles = document.getElementsByClassName("circular-menu");

function draw(offset) {
    let offsetChanger = Math.sin(offset / oSpeedInner) * oDistanceInner;

    for (let i = 0; i < circles.length; i++) {
        //circle is round.
        circles[i].style.width = w;
        circles[i].style.height = w;

        items = document.getElementsByClassName("circular-menu-item-" + i);
        circleEdge = document.getElementsByClassName("circular-menu-" + i);
        cB = circles[i].getBoundingClientRect();

        // Fun browser test below
        /* for(let c = 0; c<items.length;c++){
    e = items[c];
    radius = cB.width/2;
    xPos = (Math.cos((offset+offsetChanger + (c*20))/oSpeedOuter + c * (2*Math.PI/items.length)) * radius)    + cB.width/2;
    yPos = (Math.sin((offset+offsetChanger + (c*20))/oSpeedOuter + c * (2*Math.PI/items.length)) * radius)    + cB.height/2;


    e.style.left = xPos - e.getBoundingClientRect().width/2  + "px"; 
    e.style.top  = yPos - e.getBoundingClientRect().height/2 + "px";
} */
    }
}


let fps = 60;
let o = 0;

function circleLoop() {
    draw(o);
    o++;
    let condition = (o == 500) && false;
    if (!condition) {
        setTimeout(circleLoop, 1000 / fps);
    }
}

let toggle = false;
let cycle = 2000;

function shadowLoop() {
    let circles = document.getElementsByClassName("circular-menu");

    if (!toggle) {

        for (let i = 0; i < circles.length; i++) {
            circles[i].style.boxShadow = "inset 0px 0px 0px 2px rgb(255, 255, 255)";
        }
        toggle = true;
    } else if (toggle) {

        for (let i = 0; i < circles.length; i++) {
            circles[i].style.boxShadow = "inset 0px 0px 200px 2px rgb(255, 255, 255)";
        }
        toggle = false;
    }

    let condition = (o == 500) && false;
    if (!condition) {
        setTimeout(shadowLoop, 2000);
    }
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
        if (keyName == 1) {
            setMode(1);
        }
        if (keyName == 2) {
            setMode(2);
        }
        if (keyName == 'n') {
            reduceNode()
        }
        if (keyName == 'm') {
            increaseNode()
        }
        if (keyName == 'p') {
            alert('Paused script')
        }
    }
}, false);

createMenus(15);
circleLoop();
shadowLoop();

//Redo: every circle has internal settimeout to it's own function