// Sketch Two
var sketch = function( p ) {
  "use strict";

  var pen_state, x, y, dx, dy, scale_factor, half_screen;
  var screen_width, screen_height;
  var model_x, model_s, model_z;
  var record_mode = true;
  var recording = [];
  var user_timeout_init = 120;
  var user_timeout = user_timeout_init;
  var Train_N_Times = 1;

  var restart = function(record_mode_) {

    if (typeof(record_mode_) === "boolean") {
      record_mode = record_mode_;
    } else {
      record_mode = false;
    }

    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    dx = 0;
    dy = 0;

    scale_factor = 12.0;
    user_timeout = user_timeout_init;

    pen_state = 0;

    x = 25;
    y = screen_height/2;

    // initialize the model with zero states and zero input:
    model_x = Model.zero_input();
    model_s = Model.zero_state();
    // spice it up with random states:
    // model_x = Model.random_input();
    // model_s = Model.random_state();

  };

  p.setup = function() {
    restart();
    half_screen = screen_width/2;
    p.createCanvas(screen_width, screen_height);
    p.frameRate(30);
    redraw_background();
  };

  var redraw_background = function() {
    p.background(255);
    p.fill(255);
    //p.stroke(255, 140, 0, 192);
    //p.strokeWeight(1.0);
    //p.line(half_screen,0,half_screen,screen_height);
  };

  var sample = function() {
    model_s = Model.update(model_x, model_s);
    model_z = Model.get_mixture_coef(model_s);
    model_x = Model.sample(model_z);

    //dx = Model.randn(0.4, 4); // random walk x
    //dy = Model.randn(0, 4);  // random walk y
    dx = model_x.get(0)*scale_factor;
    dy = model_x.get(1)*scale_factor;

    if (pen_state == 0) {
      p.strokeWeight(0.5);
      p.stroke(255, 99, 71);
      p.line(x, y, x+dx, y+dy);
    }
    x += dx;
    y += dy;

    p.ellipse(x, y, 1.5, 1.5);

    pen_state = model_x.get(2); // the pen state output is used to draw the _next_ line.

    /*if (x > screen_width + 25) {
      restart();
      redraw_background();
    }*/
  };

  var train = function () {
    var i = 0;
    var N = recording.length;
    // initialize the model with zero states and zero input:
    model_s = Model.zero_state();
    console.log('start training.');
    for (i=0;i<N;i++) {
      model_x.set(0, recording[i][0]/scale_factor);
      model_x.set(1, recording[i][1]/scale_factor);
      model_x.set(2, recording[i][2]);
      if (i < N-1) {
        model_s = Model.update(model_x, model_s);
      }
    }

    recording = [];
    console.log('done training.');
  };

  var shift_recording = function() {
    // shifts first dx, and also the paper states by 1.
    var i, j, sum_x, max_x, sum_y;
    var repeated_recording = [];
    sum_x = 0;
    sum_y = 0;
    max_x = 0;
    for (i=0;i<recording.length-1;i++) {
      recording[i][2] = recording[i+1][2];
      sum_y += recording[i][1];
      sum_x += recording[i][0];
      max_x = Math.max(sum_x, max_x);
    }
    recording[recording.length-1][2] = 1;
    sum_y += recording[recording.length-1][1];
    recording[0][0] += 25 + (max_x-sum_x);
    recording[0][1] -= sum_y;
    for (j=0;j<Train_N_Times;j++) {
      for (i=0;i<recording.length;i++) {
        repeated_recording.push(recording[i]);
      }
    }
    recording = repeated_recording;
  }

  p.draw = function() {

    if (p.mouseIsPressed) {
      user_timeout = user_timeout_init;
      if (record_mode === false) {
        record_mode = true;
        recording = [];
        redraw_background();
        x = p.mouseX
        y = p.mouseY
        p.ellipse(x, y, 1.5, 1.5);
      } else {
        dx = p.mouseX-x;
        dy = p.mouseY-y;
        p.ellipse(p.mouseX, p.mouseY, 1.5, 1.5);
        if (pen_state == 0) {
          p.strokeWeight(0.5);
          p.stroke(255, 99, 71);
          p.line(x, y, x+dx, y+dy);
        }
        x += dx;
        y += dy;
        recording.push([dx, dy, pen_state]);
      }
      pen_state = 0;
    } else {
      if (record_mode) {
        pen_state = 1;
      }
    }

    if (record_mode === true) {
      user_timeout -= 1;
      if (user_timeout < 0) {
        user_timeout = user_timeout_init;
        record_mode = false;
        shift_recording();
      }
    }

    if (record_mode === false) {
      if (recording.length > 0) {
        train();
        /*
        var s = recording.shift();
        dx = s[0];
        dy = s[1];

        if (pen_state == 0) {
          p.strokeWeight(0.5);
          p.stroke(255, 99, 71);
          p.line(x, y, x+dx, y+dy);
        }

        x += dx;
        y += dy;

        p.ellipse(x, y, 1.5, 1.5);

        pen_state = s[2]; // the pen state output is used to draw the _next_ line.
        */
      } else if (x < screen_width-30) {
        sample();
      }
    }

  };

};
var custom_p5 = new p5(sketch, 'sketch');
