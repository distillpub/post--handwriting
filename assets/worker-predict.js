importScripts("model.min.js");

//
// This worker keeps the state of a single global model.
//
var modelX, modelS;
var x, y;
var temperature = 0.65;

reset();

//
// message event from main thread
//
onmessage = function(m) {
  if (m.data.reset) reset();
  if (typeof +m.data.temperature === "number") temperature = +m.data.temperature;
  if (m.data.update) update(m.data.update[0], m.data.update[1],m.data.update[2]);
  if (m.data.predict) {
    var output = predict(modelX, modelS, m.data.predict);
    postMessage(output);
  }
}

//
// Resets the global model
//
function reset() {
  x = 0;
  y = 0;
  modelX = Model.zero_input();
  modelS = Model.zero_state();
}

//
// Makes a predictive stroke from the global model without modifying the
// global state of the model.
//
function predict(modelX, modelS, steps) {
  var coordinates = [];
  var dx = 0,
      dy = 0;
  var penState = 0;

  var localModelX = modelX.clone();
  var localModelZ;
  var localModelS = [
    modelS[0].clone(),
    modelS[1].clone()
  ];

  for (var i = 0; i < steps; i++) {
    localModelS = Model.update(localModelX, localModelS);
    localModelZ = Model.get_mixture_coef(localModelS);
    localModelX = Model.sample(localModelZ, temperature);

    dx = localModelX.get(0);
    dy = localModelX.get(1);
    penState = localModelX.get(2);

    coordinates.push([dx, dy, penState]);

  }
  return[x, y, coordinates];
}

//
// Updates the global model with new user coordinates
//
function update(dx, dy, penState) {
  modelX.set(0, dx);
  modelX.set(1, dy);
  modelX.set(2, penState);
  modelS = Model.update(modelX, modelS);
  x += dx;
  y += dy;
}
