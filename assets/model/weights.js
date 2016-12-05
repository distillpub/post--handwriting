
var string_to_uint8array = function(b64encoded) {
  var u8 = new Uint8Array(atob(b64encoded).split("").map(function(c) {
      return c.charCodeAt(0); }));
  return u8;
}

var uintarray_to_string = function(u8) {
	var b64encoded = btoa(String.fromCharCode.apply(null, u8));
	return b64encoded;
};

function encode_array(raw_array) {
	var i;
	var N = raw_array.length;
	var x = [];
	for (i=0;i<N;i++) {
		x.push(raw_array[i]+127);
	}
	var u8 = new Uint8Array(x);
	return uintarray_to_string(u8);
}

function decode_string(b64encoded) {
	var i;
	var raw_array = string_to_uint8array(b64encoded);
	var N = raw_array.length;
	var x = [];
	for (i=0;i<N;i++) {
		x.push(raw_array[i]-127);
	}
	return x;
}

function encode_2d_array(raw_2d_array) {
	var i;
	var N = raw_2d_array.length;
	var x = [];
	var temp;
	for (i=0;i<N;i++) {
		temp = encode_array(raw_2d_array[i]);
		x.push(temp);
	}
	return x;
}

function decode_2d_string(raw_2d_array) {
	var i;
	var N = raw_2d_array.length;
	var x = [];
	var temp;
	for (i=0;i<N;i++) {
		temp = decode_string(raw_2d_array[i]);
		x.push(temp);
	}
	return x;
}

var bdata = lstm_data;

var raw_output_w = decode_2d_string(bdata[0]);
var raw_output_b = decode_string(bdata[1]);
var raw_LSTM_Wxh = decode_2d_string(bdata[2]);
var raw_LSTM_Whh = decode_2d_string(bdata[3]);
var raw_LSTM_bias = decode_string(bdata[4]);

var scale_output_w = 1.5;
var scale_output_b = 2.5;
var scale_LSTM_Wxh = 2.0;
var scale_LSTM_Whh = 0.8;
var scale_LSTM_bias = 1.5;

var output_w = nj.array(raw_output_w);
var output_b = nj.array(raw_output_b);
var LSTM_Wxh = nj.array(raw_LSTM_Wxh);
var LSTM_Whh = nj.array(raw_LSTM_Whh);
var LSTM_bias = nj.array(raw_LSTM_bias);

output_w = output_w.divide(127);
output_w = output_w.multiply(scale_output_w);
output_b = output_b.divide(127);
output_b = output_b.multiply(scale_output_b);
LSTM_Wxh = LSTM_Wxh.divide(127);
LSTM_Wxh = LSTM_Wxh.multiply(scale_LSTM_Wxh);
LSTM_Whh = LSTM_Whh.divide(127);
LSTM_Whh = LSTM_Whh.multiply(scale_LSTM_Whh);
LSTM_bias = LSTM_bias.divide(127);
LSTM_bias = LSTM_bias.multiply(scale_LSTM_bias);
