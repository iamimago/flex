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

function createMenus(amount) {
    const wH = window.innerHeight;
    for (let c = 2; c < amount + 2; c++) {
        const el = document.createElement("div");
        el.setAttribute("class", "circular-menu-" + (c - 2) + " circular-menu");

        el.style.width = wH / amount * (c - 1) - 20 + "px";
        el.style.height = wH / amount * (c - 1) - 20 + "px";
        el.style.zIndex = amount - (c - 2);
        document.getElementById("circle-wrapper").appendChild(el);
    }
}

const cycle = 2000;

function shadowLoop() {
    const circles = document.getElementsByClassName("circular-menu");

    for (let i = 0; i < circles.length; i++) {
        const el = circles[i];
        el.toggle = false;


        el.toggleOn = () => {
            el.style.boxShadow = "0px 0px 100px 20px rgb("+ Math.random()*255+", "+ Math.random()*255+", "+ Math.random()*255+"), inset 0px 0px 100px 50px rgb("+ Math.random()*255+", "+ Math.random()*255+", "+ Math.random()*255+")";
        }

        el.toggleOff = () => {
            el.style.boxShadow = "0px 0px 0px 2px rgb("+ Math.random()*255+", "+ Math.random()*255+", "+ Math.random()*255+"), inset 0px 0px 0px 2px rgb("+ Math.random()*255+", "+ Math.random()*255+", "+ Math.random()*255+")";
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
            (2000 / circles.length) * i);
    }
}

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
    console.log("Message received by worker");
};


var msg = "Start yourself, worker!";

w.postMessage({
    'cmd': 'start',
    'msg': msg
});

const mainFps = 60;

function mainLoop() {
    // 
    setTimeout(() => {
        mainLoop();
    }, 1000 / mainFps);
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

function clickMenu(mode) {
    //TODO: Move menu to top left
    const menu = document.getElementById("square-menu");
    const menuList = document.getElementsByClassName("smenu-item");
    const border = document.getElementById("wrapper").getBoundingClientRect();

    //MENU MAX -> MAKE MIN
    if (menuList[0].dataset.toggle == "max") {
        document.getElementById("title").style.paddingTop = "5%";
        document.getElementById("text-wrapper").style.opacity = "1";

        for (var i of menuList) {
            i.children[0].innerHTML = i.dataset.type.slice(0, 1);
            i.style.height = "50px";
            i.style.width = "50px";
            i.dataset.toggle = 'min';
        }

        menu.style.transform = "translate(0%,0%)";

        menu.style.top = 10 + "px";
        menu.style.left = border.x + 10 + 'px';

        menu.style.width = "350px";
        menu.style.height = "50px";

        //TODO: Move up kinago.tech title, then fade in semi transparent text window
        switch (mode) {
            case "home":

                break;

            case "comp":

                break;

            case "exp":

                break;

            case "cv":

                break;

            default:
                break;
        }


        //MENU MIN -> MAKE MAX
    } else {
        switch (mode) {
            case "home":
                document.getElementById("title").style.paddingTop = "10%";
                document.getElementById("text-wrapper").style.opacity = "0";

                for (var i of menuList) {
                    i.children[0].innerHTML = i.dataset.type.slice(0, 1);
                    i.style.height = "200px";
                    i.style.width = "200px";
                    i.dataset.toggle = 'max';
                    i.children[0].innerHTML = i.dataset.type;
                }

                menu.style.transform = "translate(-50%,-50%)";

                menu.style.top = "50vh";
                menu.style.left = "50vw";

                menu.style.width = "500px";
                menu.style.height = "500px";

                //TODO: Move up kinago.tech title, then fade in semi transparent text window
                break;

            case "comp":

                break;

            case "exp":

                break;

            case "cv":

                break;

            default:
                break;
        }
    }
}

initMenues();
createMenus(5);
shadowLoop();
mainLoop();