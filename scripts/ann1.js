LoadLibrary("neural");

function msg(s) {
	Debugln(s);
	Println(s);
}

function dump(s) {
	msg(JSON.stringify(s));
}

var input = [[0, 0], [0, 1], [1, 0], [1, 1]];
var output = [[0], [1], [1], [0]];

msg("GENANN example 1.\n");
msg("Train a small ANN to the XOR function using backpropagation.\n");

var ann = new Neural(2, 1, 2, 1);
dump(ann);
for (var j = 0; j < 3000; ++j) {
	for (var i = 0; i < input.length; i++) {
		ann.Train(input[i], output[i], 3);
	}
}

for (var i = 0; i < input.length; i++) {
	msg("Result for " + input[i] + ": " + ann.Run(input[i]));
}
