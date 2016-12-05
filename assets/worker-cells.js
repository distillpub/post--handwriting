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
  if (m.data.update) {
    update(m.data.update[0], m.data.update[1],m.data.update[2]);
    postMessage({step: modelS[1].tolist(), stepIndex: m.data.stepIndex})
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
