/* Diverse functionality for the menues and such */

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