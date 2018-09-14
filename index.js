/* Main javascript file. Used for initialization of stuff.*/
/* Global declarations */
let max = 10000000;

/* Alterable variables */
const cycle = 2000,
    useOtherBg = true,
    amountCircles = 9;
    useAIBackground = false,
    mainFps = 60;

let offset = 0,
    jQuerySupport = false,
    storageSupport = false;

(() => {
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

    function initAIAnim() {
        jQuerySupport ? $.getScript("nnetwork/engine.js") : console.log("-- Cannot load engine, jQuery not supported");
    }

    const init = () => {
        jQuerySupport = window.jQuery ? () => {
            console.log("---jQuery loaded from googleapi---");
            jQuerySupport = true
        } : console.log("---jQuery failed to load---");
        storageSupport = typeof (Storage) !== "undefined" ? console.log("---Storage supported---") : console.log("---Storage unsupported---");

        document.addEventListener('keydown', (event) => {
            console.log("Hello?");
            
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

        initMenues();
        if (useOtherBg) {
            $.getScript('bganims/bgAnim_2_rows_alt_1.js');
            setTimeout(checkLoaded, 1);
        };
        if (useAIBackground) {
            initAIAnim()
        };
    }

    function mainLoop() {
        setTimeout(() => {
            mainLoop();
        }, 1000 / mainFps);
    }

    function loop() {
        if (bgAnimLoop) {
            bgAnimLoop();
            offsetLoop();
        }
        mainLoop();
    }

    function start() {
        init();
    }

    start();
})();