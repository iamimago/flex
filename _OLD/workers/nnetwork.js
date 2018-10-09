/* Neural network test in javascript handmade for understandabillity which is totally a word i think. Kira is cute. 

The structure and some of the code is sort of off since the code is basically a translation from a phython project using Numpy. */


self.addEventListener('message', function (e) {

    //TODO: Message protocol for sending input values to worker an for the worker to return information on whatever it's calcing
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            self.postMessage('WORKER circleLoop STARTED: ' + data.msg);
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
                console.log("Didnt work fuck sake: " + error);

            }
            break;

        default:
            self.postMessage('Unknown command: ' + data.msg);
    }
}, false);

class Network {

    constructor(sizes) {

        this.num_layers = sizes.length;
        this.sizes = sizes;
        let arr = new Array();
        for (let i = 1; i < sizes.length; i++) {
            //i = 1 skips first layer of neurons (input layers). For each new layer, create a new array with biases. 
            arr.push(new Array());
            for (let _i = 0; _i < sizes[i]; _i++) {
                arr[i - 1][_i] = Math.random();
            }
        }
        this.biases = arr;

        arr = new Array();
        for (let i = 1; i < sizes.length; i++) {
            //i = 1 skips first layer of neurons (input layers). For each new layer, create a new array with biases. 
            arr.push(new Array());
            for (let i2 = 0; i2 < sizes[i]; i2++) {
                arr[i - 1].push(new Array());
                for (let i3 = 0; i3 < sizes[i - 1]; i3++) {
                    arr[i - 1][i2][i3] = Math.random();
                }
            }
        }
        this.weights = arr;

    }

    //Squish that silly number down to somethign comprehensable
    sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }

    //Return the output of the network if a is the input. 
    //For each neuron, 
    feedforward(a) {
        let sum1 = 0;
        let tempArr = [];

        for (let i = 0; i < this.biases.length; i++) {
            for (let i2 = 0; i2 < this.biases[i].length; i2++) {
                for (let i3 = 0; i3 < this.weights[i][i2].length; i3++) {
                    sum1 = this.weights[i][i2][i3] * a[i3];
                }
                sum1 += this.biases[i][i2];
                tempArr.push(this.sigmoid(sum1));
            }
            a = tempArr;
            tempArr = [];
        }
        return a;
    }

    SGD(training_data, epochs, mini_batches_size, eta, test_data = null) {
        let n_test;
        if (test_data) {
            n_test = test_data.length
        }
        let n = training_data.length;
        let j;

        for (j in epochs) {
            training_data = shuffle(training_data);

            /* Start at 0, loop up until n, use steps which is mini_batch_size large */
            let mini_batches = [];
            for (let i = 0; i < n; i += mini_batches_size) {
                mini_batches.push(training_data.slice(i, i + mini_batches_size));
            }
            let mini_batch;
            for (mini_batch in mini_batches) {
                this.update_mini_batch(mini_batch, eta);
            }

            if (test_data) {
                console.log("Epoch: " + j + " answers correct: " + self.evaluate(test_data) + "/" + n_test);
            }
        }
    }

    update_mini_batch(mini_batch, eta) {
        let delta_nabla_b, delta_nabla_w, nabla_b, nabla_w, x, y;
        nabla_b = arrShapeFill(this.biases, 0, 0);
        nabla_w = arrShapeFill(this.weights, 0, 0);

        for (let i = 0; i < mini_batch.length; i++) {
            x = mini_batch[i][0]; //Getting inputs
            y = mini_batch[i][1]; //Getting correct answer

            const res = this.backprop(x, y);
            delta_nabla_b = res[0];
            delta_nabla_w = res[1];

            nabla_b = nablaFiller(nabla_b, delta_nabla_b, 0);
            nabla_w = nablaFiller(nabla_w, delta_nabla_w, 0);
        }

        self.weights = wbFiller(this.weights, nabla_w, mini_batch, eta, 0);
        self.biases = wbFiller(this.biases, nabla_b, mini_batch, eta, 0);
    }

    backprop(x, y) {
        let nabla_b, nabla_w, activation, activations, z, zs, tempArr;
        activations = [];
        zs = [];
        tempArr = [];

        nabla_b = arrShapeFill(this.biases, 0, 0);
        nabla_w = arrShapeFill(this.weights, 0, 0);
        activation = x;
        activations.push(x);

        for (let i = 0; i < this.biases.length; i++) {
            for (let i2 = 0; i < this.biases[i].length; i2++) {
                let sum = 0;
                for (let i3 = 0; i < this.weights[i][i2].length; i3++) {
                    sum += this.weights[i][i2][i3] + activation[i3];
                }
                sum += this.biases[i][i2];
                z = sum;
                tempArr.push(z);
            }

            activation[i][i2] = this.sigmoid(z);
            activations.append(activation);
        }
    }
}

/* Function to set the weights. Structure is the same as the two funcitons afterwards because that's the
best system too loop through a multidimensional array i know of. Too lazy to figure out a better general solution. */
function wbFiller(wb, nwb, mini_batch, eta, i) {
    //Using i as iterator
    while (wb[i] != undefined) {
        if (wb[i] instanceof Array) {
            //If array, call recursivly on that subarray (arr[i])
            wb[i] = arrShapeFill(wb[i], nwb[i], mini_batch, eta, 0);
        } else {
            //If not array, iterate through the subarray and fill with value. Return array/subarray when done.
            wb[i] = wb[i] - (eta / mini_batch.length) * nwb[i];
            if (i + 1 == wb.length) {
                return wb;
            }
        }
        //Move to next item in array
        i++;
    }
}

function nablaFiller(arr, arr2, i) {
    //Using i as iterator
    while (arr[i] != undefined) {
        if (arr[i] instanceof Array) {
            //If array, call recursivly on that subarray (arr[i])
            arr[i] = arrShapeFill(arr[i], value, 0);
        } else {
            //If not array, iterate through the subarray and fill with value. Return array/subarray when done.
            arr[i] = arr[i] + arr2[i];
            if (i + 1 == arr.length) {
                return arr;
            }
        }
        //Move to next item in array
        i++;
    }
}

function arrShapeFill(arr, value, i) {
    //Using i as iterator
    while (arr[i] != undefined) {
        if (arr[i] instanceof Array) {
            //If array, call recursivly on that subarray (arr[i])
            arr[i] = arrShapeFill(arr[i], value, 0);
        } else {
            //If not array, iterate through the subarray and fill with value. Return array/subarray when done.
            arr[i] = value;
            if (i + 1 == arr.length) {
                return arr;
            }
        }
        //Move to next item in array
        i++;
    }
}

function shuffle(array) {
    let copy = [],
        n = array.length,
        i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}

var net = new Network([784, 4, 10]);

console.log("new Network([784, 4, 5]) \nweights: ");
console.log(net.weights);
console.log("bias: ");
console.log(net.biases);

net.update_mini_batch(null, null);