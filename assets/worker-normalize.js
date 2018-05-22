// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

importScripts("model.min.js");

//
// This worker keeps the state of a single global model.
//
var modelX, modelS;
var x, y;
var temperature = 0.1;
var coordinates;
var lastPenState;

reset();

//
// message event from main thread
//
onmessage = function(m) {
  if (m.data.reset) reset();
  // if (typeof +m.data.temperature === "number") temperature = +m.data.temperature;
  if (m.data.update) update(m.data.update[0], m.data.update[1],m.data.update[2]);
}

//
// Resets the global model
//
function reset() {
  x = 0;
  y = 0;
  lastPenState = 1;
  coordinates = [];
  modelX = Model.random_input();
  modelS = Model.random_state();
  modelS = Model.update(modelX, modelS);

}

//
// Makes a predictive stroke from the global model without modifying the
// global state of the model.
//
// function predict(modelX, modelS, steps) {
//   var coordinates = [];
//   var dx = 0,
//       dy = 0;
//   var penState = 0;

//   var localModelX = modelX.clone();
//   var localModelZ;
//   var localModelS = [
//     modelS[0].clone(),
//     modelS[1].clone()
//   ];

//   for (var i = 0; i < steps; i++) {
//     localModelS = Model.update(localModelX, localModelS);
//     localModelZ = Model.get_mixture_coef(localModelS);
//     localModelX = Model.sample(localModelZ, temperature);

//     dx = localModelX.get(0);
//     dy = localModelX.get(1);
//     penState = localModelX.get(2);

//     coordinates.push([dx, dy, penState]);

//   }
//   return[x, y, coordinates];
// }

//
// Updates the global model with new user coordinates
//
function update(dx, dy, penState) {
  if (lastPenState || penState) {
    var adx = dx;
    var ady = dy;
  } else {
    var localModelZ = Model.get_mixture_coef(modelS);
    var localModelX = Model.sample(localModelZ, temperature);
    var adx = dx * 0.2 + localModelX.get(0) * 0.8;
    var ady = dy * 0.2 + localModelX.get(1) * 0.8;

  }
  modelX.set(0, adx);
  modelX.set(1, ady);
  modelX.set(2, penState);
  modelS = Model.update(modelX, modelS);
  x += adx;
  y += ady;
  coordinates.push([adx, ady, penState]);
  lastPenState = penState;
  postMessage(coordinates);
}
