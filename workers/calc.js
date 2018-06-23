var mode = 0;

self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            self.postMessage('WORKER circleLoop STARTED: ' + data.msg);
            circleLoop();
            break;
        case 'stop':
            self.postMessage('WORKER STOPPED: ' + data.msg +
                '. (buttons will no longer work)');
            self.close(); // Terminates the worker.
            break;

        case 'pop':
            try {
                self.postMessage('WORKER POPPOING RANDOM ' + workerStorage.pop() + " message: " + data.msg);
                
            } catch (error) {
                console.log("Didnt work fuck sake: "+ error);
                
            }
            break;

        default:
            self.postMessage('Unknown command: ' + data.msg);
    }
}, false);

const fps = 30;
var workerStorage = [];
const stringLength = 1000000;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < stringLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

let r;

function circleLoop() {
    switch (mode) {
        case 0:
        
            /* var t0 = performance.now();
            r = makeid();
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds. workerStorage length: " + workerStorage.length);
            workerStorage.push(r); */

            break;

        case 1:
            console.log("Worker + " + this + " mode: " + 1);

            break;

        case 2:
            console.log("Worker + " + this + " mode: " + 2);

            break;

        case 3:
            console.log("Worker + " + this + " mode: " + 3);

            break;

        default:
            console.log("Worker + " + this + " mode: " + mode);
            break;
    }

    const condition = false;
    if (!condition) {
        setTimeout(circleLoop, 1000 / fps);
    }
}