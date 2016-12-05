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
