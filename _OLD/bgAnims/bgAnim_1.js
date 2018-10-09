let bgAnim_1 = new function(){
    let r = 0;
    let g = 85;
    let b = 170;
    let rt = 1;
    let bt = 1;
    let gt = 1;


    this.initBgAnim = (amount) => {
        const wH = window.innerWidth;
        const wrapper = document.createElement('div');
        wrapper.id = "circle-wrapper";
        document.getElementsByClassName("background-container")[0].appendChild(wrapper);

        for (let c = 2; c < amount + 2; c++) {
            const el = document.createElement("div");
            el.setAttribute("class", "circular-menu-" + (c - 2) + " circular-menu");

            el.style.width = wH / amount * (c - 1) - 20 + "px";
            el.style.height = wH / amount * (c - 1) - 20 + "px";
            el.style.zIndex = amount - (c - 2);
            document.getElementById("circle-wrapper").appendChild(el);
        }

        document.getElementById("circle-wrapper").style.opacity = "1";
        let cMenuClass = document.getElementsByClassName("circular-menu")[0];
        cMenuClass.style.transition = "all + " + (cycle / 1000) + "s";

        this.bgAnimLoop();
        this.offsetLoop();
    }

    this.bgAnimLoop = () => {
        const circles = document.getElementsByClassName("circular-menu");

        for (let i = 0; i < circles.length; i++) {
            const el = circles[i];
            el.toggle = false;


            el.toggleOn = () => {
                el.style.boxShadow = "0px 0px 100px 20px rgb(" + r + ", " + g + ", " + b + "), inset 0px 0px 100px 50px rgb(" + r + ", " + g + ", " + b + ")";
            }

            el.toggleOff = () => {
                el.style.boxShadow = "0px 0px 0px 2px rgb(" + r + ", " + g + ", " + b + "), inset 0px 0px 0px 2px rgb(" + r + ", " + g + ", " + b + ")";
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

        return true;
    }

    this.offsetLoop = () => {
        r += rt;
        g += gt;
        b += bt;
        
        rt = r == 255 ? -1 : r == 0 ? 1 : rt;
        gt = g == 255 ? -1 : g == 0 ? 1 : gt;
        bt = b == 255 ? -1 : b == 0 ? 1 : bt;
    
        setTimeout(() => {
            this.offsetLoop();
        }, 1000 / mainFps);
    }
}