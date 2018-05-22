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

// generates random dummy dataset, and provides an interface to easily access that data from example.js
// data generation based on https://github.com/tensorflow/playground
// adopted from https://github.com/tensorflow/playground/blob/master/dataset.ts

if (typeof module !== "undefined") {
  var nj = require("./numjs.js");
}

var Model = {};

(function(global) {
  "use strict";

  // settings
  var num_units=500;
  var N_mixture=20;
  var input_size=3;
  var W_full=nj.concatenate([LSTM_Wxh.T, LSTM_Whh.T]).T; // training size
  var bias=LSTM_bias;
  var forget_bias=1.0;
  var h_w = output_w;
  var h_b = output_b;

  var zero_state = function() {
    return [nj.zeros(num_units), nj.zeros(num_units)];
  };

  var random_state = function() {
    var std_ = 0.1;
    var h = nj.zeros(num_units);
    var c = nj.zeros(num_units);
    var i = 0;
    for(i=0;i<num_units;i++) {
      h.set(i, randn(0, std_));
      c.set(i, randn(0, std_));
    }
    return [h, c];
  };

  var zero_input = function() {
    return nj.zeros(input_size);
  };

  var random_input = function() {
    var std_ = 0.1;
    var x = nj.zeros(input_size);
    var pen_s = 0;
    if (randf(0, 1) > 0.9) pen_s = 1;
    x.set(0, randn(0, std_));
    x.set(1, randn(0, std_));
    x.set(2, pen_s);
    return x;
  };

  var update = function(x, s) {
    var h = s[0];
    var c = s[1];
    var concat = nj.concatenate([x, h]);
    var hidden = nj.dot(concat, W_full);
    hidden = nj.add(hidden, bias);

    var i=nj.sigmoid(hidden.slice([0*num_units, 1*num_units]));
    var g=nj.tanh(hidden.slice([1*num_units, 2*num_units]));
    var f=nj.sigmoid(nj.add(hidden.slice([2*num_units, 3*num_units]), forget_bias));
    var o=nj.sigmoid(hidden.slice([3*num_units, 4*num_units]));

    var new_c = nj.add(nj.multiply(c, f), nj.multiply(g, i));
    var new_h = nj.multiply(nj.tanh(new_c), o);

    return [new_h, new_c];
  }

  var get_mixture_coef = function(s) {
    var h = s[0];
    var NOUT = N_mixture;
    var z=nj.add(nj.dot(h, h_w), h_b);
    var z_eos = nj.sigmoid(z.slice([0, 1]));
    var z_pi = z.slice([1+NOUT*0, 1+NOUT*1]);
    var z_mu1 = z.slice([1+NOUT*1, 1+NOUT*2]);
    var z_mu2 = z.slice([1+NOUT*2, 1+NOUT*3]);
    var z_sigma1 = nj.exp(z.slice([1+NOUT*3, 1+NOUT*4]));
    var z_sigma2 = nj.exp(z.slice([1+NOUT*4, 1+NOUT*5]));
    var z_corr = nj.tanh(z.slice([1+NOUT*5, 1+NOUT*6]));
    z_pi = nj.subtract(z_pi, z_pi.max());
    z_pi = nj.softmax(z_pi);

    return [z_pi, z_mu1, z_mu2, z_sigma1, z_sigma2, z_corr, z_eos];
  };

  var sample_pi_idx = function(z_pi) {
    var x = randf(0, 1);
    var N = N_mixture;
    var accumulate = 0;
    var i = 0;
    for (i=0;i<N;i++) {
      accumulate += z_pi.get(i);
      if (accumulate >= x) {
        return i;
      }
    }
    console.log('error sampling pi index');
    return -1;
  };

  var sample_eos = function(z_eos) {
    // eos = 1 if random.random() < o_eos[0][0] else 0
    var eos = 0;
    if (randf(0, 1) < z_eos.get(0)) {
      eos = 1;
    }
    return eos;
  }

  var sample = function(z) {
    // z is [z_pi, z_mu1, z_mu2, z_sigma1, z_sigma2, z_corr, z_eos]
    // returns [x, y, eos]
    var idx = sample_pi_idx(z[0]);
    var mu1 = z[1].get(idx);
    var mu2 = z[2].get(idx);
    var sigma1 = z[3].get(idx);
    var sigma2 = z[4].get(idx);
    var corr = z[5].get(idx);
    var eos = sample_eos(z[6]);
    var delta = birandn(mu1, mu2, sigma1, sigma2, corr);
    return nj.array([delta[0], delta[1], eos]);
  }

  // Random numbers util (from https://github.com/karpathy/recurrentjs)
  var return_v = false;
  var v_val = 0.0;
  var gaussRandom = function() {
    if(return_v) {
      return_v = false;
      return v_val;
    }
    var u = 2*Math.random()-1;
    var v = 2*Math.random()-1;
    var r = u*u + v*v;
    if(r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2*Math.log(r)/r);
    v_val = v*c; // cache this
    return_v = true;
    return u*c;
  }
  var randf = function(a, b) { return Math.random()*(b-a)+a; };
  var randi = function(a, b) { return Math.floor(Math.random()*(b-a)+a); };
  var randn = function(mu, std){ return mu+gaussRandom()*std; };
  // from http://www.math.grin.edu/~mooret/courses/math336/bivariate-normal.html
  var birandn = function(mu1, mu2, std1, std2, rho) {
    var z1 = randn(0, 1);
    var z2 = randn(0, 1);
    var x = Math.sqrt(1-rho*rho)*std1*z1 + rho*std1*z2 + mu1;
    var y = std2*z2 + mu2;
    return [x, y];
  };

  global.zero_state = zero_state;
  global.zero_input = zero_input;
  global.random_state = random_state;
  global.random_input = random_input;
  global.update = update;
  global.get_mixture_coef = get_mixture_coef;
  global.randf = randf;
  global.randi = randi;
  global.randn = randn;
  global.birandn = birandn;
  global.sample = sample;

})(Model);
(function(lib) {
  "use strict";
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = lib; // in nodejs
  }
})(Model);
