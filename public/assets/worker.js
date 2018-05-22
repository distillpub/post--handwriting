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

var penState, x, y, dx, dy;
var model_x, model_s, model_z;
var temperature = 0.65;

function restart() {
  x = 0;
  y = 0;
  dx = 0;
  dy = 0;
  penState = 0;

  model_x = Model.random_input();
  model_s = Model.random_state();
}

function step() {
  model_s = Model.update(model_x, model_s);
  model_z = Model.get_mixture_coef(model_s);
  model_x = Model.sample(model_z, temperature);
  dx = model_x.get(0);
  dy = model_x.get(1);
  penState = model_x.get(2);

  // Get an array out from the worker since nd class doesn't transfer.
  // var model_z_out = model_z.map(function(d) {
  //   var a = [];
  //   for (var i = 0; i < 20; i++) {
  //     a.push(d.get(i));
  //   }
  //   return a;
  // });

  // var samples = [];
  // for (var i = 0; i < 200; i++) {
  //   var m = Model.sample(model_z);
  //   var sx = m.get(0);
  //   var sy = m.get(1);
  //   var sp = m.get(2);
  //   samples.push([sx, sy, sp]);
  // }

  postMessage([dx, dy, penState, x, y]);
  x += dx;
  y += dy;
  if (x > 150) {
    restart();
  }
}

restart();

onmessage = function(e) {
  if (e.data.key == "temperature") temperature = e.data.value;
  if (e.data.key === "step") step();
}
