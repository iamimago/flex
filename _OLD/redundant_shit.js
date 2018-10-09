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


var weirdFunction = () => {
    var cuntface = (a, b, f) => {
        return f(a, b);
    }

    var lmao = function (var1, var2) {
        return var1 + var2;
    }

    console.log(cuntface(2, 3, lmao));
}

weirdFunction();