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
            const f = document.createElement('form');
            const pick = document.createElement('input');
            const submit = document.createElement('input');
            
            f.style.marginTop = "-100px";
            f.style.background = "rgba(130,130,130,0.7)";

            pick.type = "file";
            pick.name = "fu";

            submit.type = "submit";
            submit.value = "upload";
            submit.onclick = "fileUpload(this.form, 'index.html', 'upload')";

            f.appendChild(pick);
            f.appendChild(submit);

            document.getElementById("wrapper").appendChild(f);
            
            break;

        default:
            break;
    }

}

function fileUpload(form, action_url, div_id){
    // Create the iframe...
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");

    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";

    iframeId = document.getElementById("upload_iframe");

    // Add event...
    var eventHandler = function () {

            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
            else iframeId.removeEventListener("load", eventHandler, false);

            // Message from server...
            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }

            document.getElementById(div_id).innerHTML = content;

            // Del the iframe...
            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
        }

    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);

    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");

    // Submit the form...
    form.submit();

    document.getElementById(div_id).innerHTML = "Uploading...";
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