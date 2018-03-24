"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Perceptron = function () {
  function Perceptron() {
    var bias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var learningRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
    var weights = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Perceptron);

    this.bias = bias;
    this.learningRate = learningRate;
    this.weights = weights;
    this.trainingSet = [];
  }

  _createClass(Perceptron, [{
    key: "init",
    value: function init(inputs) {
      var bias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bias;

      // Initialize weights to 0 and adding bias weight
      this.weights = [].concat(_toConsumableArray(inputs.map(function (i) {
        return Math.random();
      })), [bias]);
    }
  }, {
    key: "train",
    value: function train(inputs, expected) {
      var _this = this;

      if (!this.weights.length) this.init(inputs);
      if (inputs.length != this.weights.length) inputs.push(1); // Adding the bias

      // Keeping this in the training set if it didn't exist
      if (!this.trainingSet.find(function (t) {
          return t.inputs.every(function (inp, i) {
            return inp === inputs[i];
          });
        })) this.trainingSet.push({
        inputs: inputs,
        expected: expected
      });

      var actual = this.evaluate(inputs);
      if (actual == expected) return true; // Correct weights return and don't touch anything.

      // Otherwise update each weight by adding the error * learningRate relative to the input
      this.weights = this.weights.map(function (w, i) {
        return w += _this.delta(actual, expected, inputs[i]);
      });
      return this.weights;
    }

    // Calculates the difference between actual and expected for a given input

  }, {
    key: "delta",
    value: function delta(actual, expected, input) {
      var learningRate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.learningRate;

      var error = expected - actual; // How far off were we
      return error * learningRate * input;
    }

    // Iterates until the weights are correctly set

  }, {
    key: "learn",
    value: function learn() {
      var _this2 = this;

      var iterationCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var trainingSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.trainingSet;

      var success = false;
      while (!success) {
        // Function of your choosing that will be called after an iteration has completed
        iterationCallback.call(this);
        success = trainingSet.every(function (t) {
          return _this2.train(t.inputs, t.expected) === true;
        });
      }
    }
    // Sum inputs * weights

  }, {
    key: "weightedSum",
    value: function weightedSum() {
      var inputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.inputs;
      var weights = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.weights;

      return inputs.map(function (inp, i) {
        return inp * weights[i];
      }).reduce(function (x, y) {
        return x + y;
      }, 0);
    }

    // Evaluate using the current weights

  }, {
    key: "evaluate",
    value: function evaluate(inputs) {
      return this.activate(this.weightedSum(inputs));
    }

    // Sugar syntax evaluate with added bias input

  }, {
    key: "predict",
    value: function predict(inputs) {
      return this.evaluate([].concat(_toConsumableArray(inputs), [1]));
    }

    // Heaviside as the activation function

  }, {
    key: "activate",
    value: function activate(value) {
      return value >= 0 ? 1 : 0;
    }
  }]);

  return Perceptron;
}();