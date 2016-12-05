"use strict";
if (typeof d3 === "undefined") var d3 = require("d3");

class SimpleModel {
  constructor(m) {
    this.Model = m;
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.previousPenState = 0;
    this.penState = 0;

    this.modelX = this.Model.zero_input();
    this.modelS = this.Model.zero_state();
    this.modelZ = this.Model.get_mixture_coef(this.modelS);
    this.coordinates = [];
  }

  update(dx, dy, pen) {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
    this.modelS = this.Model.update(this.modelX, this.modelS);
    this.modelZ = this.Model.get_mixture_coef(this.modelS);
    this.modelX = this.Model.sample(this.modelZ);

    this.dx = dx;
    this.dy = dy;
    this.previousPenState = this.penState;
    this.penState = pen;

    this.modelX.set(0, this.dx);
    this.modelX.set(1, this.dy);
    this.modelX.set(2, this.penState);

    var c = [this.dx, this.dy, this.penState, this.modelZ];
    this.coordinates.push(c);

    return c;
  }

  step(temp) {
    if (typeof temp !== "number") temp = 0.65;
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
    this.modelS = this.Model.update(this.modelX, this.modelS);
    this.modelZ = this.Model.get_mixture_coef(this.modelS);
    this.modelX = this.Model.sample(this.modelZ, temp);

    this.dx = this.modelX.get(0);
    this.dy = this.modelX.get(1);
    this.previousPenState = this.penState;
    this.penState = this.modelX.get(2);
    var c = [this.dx, this.dy, this.penState, this.modelZ];
    this.coordinates.push(c)
    return c;
  }

  unroll(steps, iterations, temp) {
    if (typeof temp !== "number") temp = 0.65;
    var paths = [];
    var that = this;
    d3.range(iterations).forEach(function() {
      var coordinates = [];
      var dx,
          dy,
          penState;

      var localModelX = that.modelX.clone();
      var localModelZ;
      var localModelS = [
        that.modelS[0].clone(),
        that.modelS[1].clone()
      ];

      for (var i = 0; i < steps; i++) {
        localModelS = that.Model.update(localModelX, localModelS);
        localModelZ = that.Model.get_mixture_coef(localModelS);
        localModelX = that.Model.sample(localModelZ, temp);

        dx = localModelX.get(0);
        dy = localModelX.get(1);
        penState = localModelX.get(2);
        coordinates.push([dx, dy, penState]);
        // if (penState) break;
      }
      // coordinates.sum = [
      //   d3.sum(coordinates, function(d) { return d[0]; }),
      //   d3.sum(coordinates, function(d) { return d[1]; })
      // ];
      paths.push(coordinates);
    });
    return paths;
  }

  sample(n, temp) {
    if (typeof temp !== "number") temp = 0.65;
    var samples = [];
    for (var i = 0; i < n; i++) {
      var mx = this.Model.sample(this.modelZ, temp);
      samples.push([
        mx.get(0),
        mx.get(1),
        mx.get(2)
      ]);
    }
    return samples;
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = SimpleModel;
}
