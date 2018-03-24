/* Neural network test in javascript handmade for understandabillity which is totally a word i think. Kira is cute. */

//Weights = the edges connecting all of the neurons in layer n to the neurons in the layer n+1. In example [2,4,5] 
/* sizes = [2,4,5] GIVES weights = [
    [[random,random],[random,random],[random,random], [random,random]], 
    [[random,random,random,random],[random,random,random,random],[random,random,random,random],
    [random,random,random,random],[random,random,random,random]]] =
    
    Array(Array(4*[random,random]), Array(5*[random,random,random,random])) 
    
    3 dimensional array required for the weights.*/

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

    /* def feedforward(self, a):
        """Return the output of the network if ``a`` is input."""
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a)+b)
        return a 
    */

    //Return the output of the network if a is the input. 
    //For each neuron, 
    feedforward(a) {
        const neuronRows = this.biases.length;
        let sum1 = 0;
        let tempArr = [];

        for (let i = 0; i < neuronRows; i++) {
            for (let i2 = 0; i2 < this.biases[i].length; i2++) {
                for(let i3 = 0; i3 < this.weights[i][i2].length; i3++){
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
    
    SGD(training_data, epochs, mini_batches_size, eta) {

    }
}

    var net = new Network([784, 4, 10]);

    console.log("new Network([784, 4, 5]) \nweights: ");
    console.log(net.weights);
    console.log("bias: ");
    console.log(net.biases);

