const MINIBATCH_AMOUNT = 5;

function construct_model(){
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [2],
        units: 16,
        activation: 'relu'
      }),
      tf.layers.dense({
        units: 2,
        activation: 'softmax'
      })
    ]
  });                  

  model.compile({
    loss: 'meanSquaredError',
    optimizer: 'adam'
  });
  return model;
}

    
let model = construct_model();
async function fit_bug(){
  await model.fit(tf.tensor2d([0,0], [1,2]), tf.tensor2d([1,1], [1, 2]),
                  {epochs: 1}); //Error occurs here
}

async function loop_through_set(){
  let s = 0, arr = [];
  for(let i = 0; i < MINIBATCH_AMOUNT; i++){
    arr.push({
      foo: "foo",
      bar: "bar"
    });
    // This works fine
    await fit_bug();
    console.log('fit for one epoch');
    //
  }
}

(async function() {
  await loop_through_set();
  console.log('done with loop_through_set');
})()

