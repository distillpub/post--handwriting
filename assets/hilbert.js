// from http://bl.ocks.org/nitaku/8947871

var LSystem = {};


LSystem.fractalize = function(config) {
  var char, i, input, output, _i, _len, _ref;
  input = config.axiom;
  for (i = 0, _ref = config.steps; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    output = '';
    for (_i = 0, _len = input.length; _i < _len; _i++) {
      char = input[_i];
      if (char in config.rules) {
        output += config.rules[char];
      } else {
        output += char;
      }
    }
    input = output;
  }
  return output;
};

/* convert a Lindenmayer string into an SVG path string
*/
LSystem.path = function(config) {
  var angle, char, path, _i, _len, _ref;
  angle = 0.0;
  path = 'M0 0';
  _ref = config.fractal;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    char = _ref[_i];
    if (char === '+') {
      angle += config.angle;
    } else if (char === '-') {
      angle -= config.angle;
    } else if (char === 'F') {
      path += "l" + (config.side * Math.cos(angle)) + " " + (config.side * Math.sin(angle));
    }
  }
  return path;
};

LSystem.grid = function(config) {
  var angle, char, i, j, len, ref, x, y;
  angle = 0.0;
  j = 1;
  var grid = [{x: 0, y: 0, j: 0}];
  ref = config.fractal;
  for (i = 0, len = ref.length; i < len; i++) {
    //if(j >= config.data.length) return grid;
    char = ref[i];
    if (char === '+') {
      angle += config.angle;
    } else if (char === '-') {
      angle -= config.angle;
    } else if (char === 'F') {
      x = config.side * Math.cos(angle);
      y = config.side * Math.sin(angle);
      x += grid[j-1].x;
      y += grid[j-1].y;
      grid.push({
        x: x,
        y: y,
        //data: config.data[j],
        j: j
      });
      j++
    }
  }
  return grid;
}

function hilbert() {
  var angle = 270 * Math.PI / 180;
  var nodes = [];
  var grid = [];
  var data = [];
  var sideLength = 20;
  var steps, hilbertConfig, hilbertFractal;

  function calculate() {
    steps = Math.ceil(Math.log2(data.length || 1) / 2)
    hilbertConfig = {
      steps: steps,
      axiom: 'A',
      rules: {
        A: '-BF+AFA+FB-',
        B: '+AF-BFB-FA+'
      }
    }
    hilbertFractal = LSystem.fractalize(hilbertConfig);
  }

  function newNodes() {
    calculate();
    nodes = [];
    grid = LSystem.grid({
      fractal: hilbertFractal,
      side: sideLength,
      angle: angle
    })
    //console.log(data, grid)
    data.forEach(function(d,i) {
      var node = {
        x: grid[i].x,
        y: grid[i].y,
        data: d,
        index: i
      }
      nodes.push(node);
    })
  }

  this.nodes = function(val) {
    if(val) {
      data = val
    }
    newNodes();
    return nodes;
  }
  this.sideLength = function(val) {
    if(val) {
      sideLength = val;
      return this;
    }
    return sideLength;
  }
}

if(typeof module != "undefined")  module.exports = hilbert;
