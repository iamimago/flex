/* Diverse functionality for the menues and such */

const menu = document.getElementById("square-menu");
const menuList = document.getElementsByClassName("smenu-item");
const border = document.getElementById("wrapper").getBoundingClientRect();
let tw;

function clickMenu(mode) {
    //TODO: Move menu to top left

    switch (mode) {
        case "home":
            if (menuList[0].dataset.toggle == "max") {
                minMenu();
            } else {
                maxMenu();
            }
            break;

        case "exp":

            break;

        case "comp":

            break;

        case "upload":
            console.log("Creating upload iframe+form");

            const iframe = document.createElement('iframe');
            const f = document.createElement('form');
            const pick = document.createElement('input');
            const submit = document.createElement('input');

            iframe.setAttribute("id", "upload_iframe");
            iframe.setAttribute("name", "upload_iframe");
            iframe.setAttribute("width", "0");
            iframe.setAttribute("height", "0");
            iframe.setAttribute("border", "0");
            iframe.setAttribute("style", "width: 0; height: 0; border: none;");

            pick.type = "file";
            pick.name = "fu";

            submit.type = "submit";

            f.appendChild(pick);
            f.appendChild(submit);
            iframe.appendChild(f);

            document.getElementById("wrapper").appendChild(iframe);
            
            break;

        default:
            break;
    }

}

function minMenu() {
    document.getElementById("title").style.paddingTop = "5%";
    tw = document.getElementById("text-wrapper");
    tw.style.opacity = "1";
    tw.style.zIndex = "5";

    for (var i of menuList) {
        i.children[0].innerHTML = i.dataset.type.slice(0, 1);
        i.style.height = "50px";
        i.dataset.toggle = 'min';
    }

    //Assynchronus to not cause glitchy movement
    setTimeout(() => {
        for (var i of menuList) {
            i.classList.add('minMenu');
        }
    }, 1000);

    menu.style.transform = "translate(0%,0%)";

    menu.style.top = 10 + "px";
    menu.style.left = border.x + 10 + 'px';

    menu.style.width = "350px";
    menu.style.height = "50px";

    //TODO: Move up kinago.tech title, then fade in semi transparent text window
}

function maxMenu() {
    document.getElementById("title").style.paddingTop = "10%";
    tw = document.getElementById("text-wrapper");
    tw.style.opacity = "0";
    tw.style.zIndex = "-5";
    for (var i of menuList) {
        i.children[0].innerHTML = i.dataset.type.slice(0, 1);
        i.style.height = "200px";
        i.style.width = "200px";
        i.dataset.toggle = 'max';
        i.children[0].innerHTML = i.dataset.type;
        i.classList.remove('minMenu');
    }

    menu.style.transform = "translate(-50%,-50%)";

    menu.style.top = "50vh";
    menu.style.left = "50vw";

    menu.style.width = "500px";
    menu.style.height = "500px";
}