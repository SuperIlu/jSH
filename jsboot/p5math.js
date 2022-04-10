/*
	This file was derived from the p5.js source code at
	https://github.com/processing/p5.js

	Copyright (c) the p5.js contributors and Andre Seidelt <superilu@yahoo.com>

	This library is free software; you can redistribute it and/or
	modify it under the terms of the GNU Lesser General Public
	License as published by the Free Software Foundation; either
	version 2.1 of the License, or (at your option) any later version.

	This library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public
	License along with this library; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

exports.createVector = function (x, y, z) {
	return new PVector(x, y, z);
};
exports.abs = Math.abs;
exports.ceil = Math.ceil;
exports.constrain = function (n, low, high) {
	return Math.max(Math.min(n, high), low);
};
exports.dist = function () {
	if (arguments.length === 4) {
		//2D
		return hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);
	} else if (arguments.length === 6) {
		//3D
		return hypot(
			arguments[3] - arguments[0],
			arguments[4] - arguments[1],
			arguments[5] - arguments[2]
		);
	}
};
exports.exp = Math.exp;
exports.floor = Math.floor;
exports.lerp = function (start, stop, amt) {
	return amt * (stop - start) + start;
};
exports.log = Math.log;
exports.mag = function (x, y) {
	return hypot(x, y);
};
exports.map = function (n, start1, stop1, start2, stop2, withinBounds) {
	var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return this.constrain(newval, start2, stop2);
	} else {
		return this.constrain(newval, stop2, start2);
	}
};
exports.max = function () {
	if (arguments[0] instanceof Array) {
		return Math.max.apply(null, arguments[0]);
	} else {
		return Math.max.apply(null, arguments);
	}
};
exports.min = function () {
	if (arguments[0] instanceof Array) {
		return Math.min.apply(null, arguments[0]);
	} else {
		return Math.min.apply(null, arguments);
	}
};
exports.norm = function (n, start, stop) {
	return this.map(n, start, stop, 0, 1);
};
exports.pow = Math.pow;
exports.round = Math.round;
exports.sq = function (n) {
	return n * n;
};
exports.sqrt = Math.sqrt;
function hypot(x, y, z) {
	// Use the native implementation if it's available
	if (typeof Math.hypot === 'function') {
		return Math.hypot.apply(null, arguments);
	}

	// Otherwise use the V8 implementation
	// https://github.com/v8/v8/blob/8cd3cf297287e581a49e487067f5cbd991b27123/src/js/math.js#L217
	var length = arguments.length;
	var args = [];
	var max = 0;
	for (var i = 0; i < length; i++) {
		var n = arguments[i];
		n = +n;
		if (n === Infinity || n === -Infinity) {
			return Infinity;
		}
		n = Math.abs(n);
		if (n > max) {
			max = n;
		}
		args[i] = n;
	}

	if (max === 0) {
		max = 1;
	}
	var sum = 0;
	var compensation = 0;
	for (var j = 0; j < length; j++) {
		var m = args[j] / max;
		var summand = m * m - compensation;
		var preliminary = sum + summand;
		compensation = preliminary - sum - summand;
		sum = preliminary;
	}
	return Math.sqrt(sum) * max;
}
var seeded = false;
var previous = false;
var y2 = 0;
var lcg = (function () {
	// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
	// m is basically chosen to be large (as it is the max period)
	// and for its relationships to a and c
	var m = 4294967296,
		// a - 1 should be divisible by m's prime factors
		a = 1664525,
		// c and m should be co-prime
		c = 1013904223,
		seed,
		z;
	return {
		setSeed: function (val) {
			// pick a random seed if val is undefined or null
			// the >>> 0 casts the seed to an unsigned 32-bit integer
			z = seed = (val == null ? Math.random() * m : val) >>> 0;
		},
		getSeed: function () {
			return seed;
		},
		rand: function () {
			// define the recurrence relationship
			z = (a * z + c) % m;
			// return a float in [0, 1)
			// if z = m then z / m = 0 therefore (z % m) / m < 1 always
			return z / m;
		}
	};
})();
exports.randomSeed = function (seed) {
	lcg.setSeed(seed);
	seeded = true;
	previous = false;
};
exports.random = function (min, max) {
	var rand;

	if (seeded) {
		rand = lcg.rand();
	} else {
		rand = Math.random();
	}
	if (typeof min === 'undefined') {
		return rand;
	} else if (typeof max === 'undefined') {
		if (min instanceof Array) {
			return min[Math.floor(rand * min.length)];
		} else {
			return rand * min;
		}
	} else {
		if (min > max) {
			var tmp = min;
			min = max;
			max = tmp;
		}

		return rand * (max - min) + min;
	}
};
exports.randomGaussian = function (mean, sd) {
	var y1, x1, x2, w;
	if (previous) {
		y1 = y2;
		previous = false;
	} else {
		do {
			x1 = this.random(2) - 1;
			x2 = this.random(2) - 1;
			w = x1 * x1 + x2 * x2;
		} while (w >= 1);
		w = Math.sqrt(-2 * Math.log(w) / w);
		y1 = x1 * w;
		y2 = x2 * w;
		previous = true;
	}

	var m = mean || 0;
	var s = sd || 1;
	return y1 * s + m;
};
var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;
var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave
var scaled_cosine = function (i) {
	return 0.5 * (1.0 - Math.cos(i * Math.PI));
};
var perlin; // will be initialized lazily by noise() or noiseSeed()
exports.noise = function (x, y, z) {
	y = y || 0;
	z = z || 0;

	if (perlin == null) {
		perlin = new Array(PERLIN_SIZE + 1);
		for (var i = 0; i < PERLIN_SIZE + 1; i++) {
			perlin[i] = Math.random();
		}
	}

	if (x < 0) {
		x = -x;
	}
	if (y < 0) {
		y = -y;
	}
	if (z < 0) {
		z = -z;
	}

	var xi = Math.floor(x),
		yi = Math.floor(y),
		zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var rxf, ryf;

	var r = 0;
	var ampl = 0.5;

	var n1, n2, n3;

	for (var o = 0; o < perlin_octaves; o++) {
		var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

		rxf = scaled_cosine(xf);
		ryf = scaled_cosine(yf);

		n1 = perlin[of & PERLIN_SIZE];
		n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
		n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
		n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
		n1 += ryf * (n2 - n1);

		of += PERLIN_ZWRAP;
		n2 = perlin[of & PERLIN_SIZE];
		n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
		n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
		n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);

		n1 += scaled_cosine(zf) * (n2 - n1);

		r += n1 * ampl;
		ampl *= perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1;
		zf *= 2;

		if (xf >= 1.0) {
			xi++;
			xf--;
		}
		if (yf >= 1.0) {
			yi++;
			yf--;
		}
		if (zf >= 1.0) {
			zi++;
			zf--;
		}
	}
	return r;
};
exports.noiseDetail = function (lod, falloff) {
	if (lod > 0) {
		perlin_octaves = lod;
	}
	if (falloff > 0) {
		perlin_amp_falloff = falloff;
	}
};
exports.noiseSeed = function (seed) {
	// Linear Congruential Generator
	// Variant of a Lehman Generator
	var lcg = (function () {
		// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
		// m is basically chosen to be large (as it is the max period)
		// and for its relationships to a and c
		var m = 4294967296;
		// a - 1 should be divisible by m's prime factors
		var a = 1664525;
		// c and m should be co-prime
		var c = 1013904223;
		var seed, z;
		return {
			setSeed: function (val) {
				// pick a random seed if val is undefined or null
				// the >>> 0 casts the seed to an unsigned 32-bit integer
				z = seed = (val == null ? Math.random() * m : val) >>> 0;
			},
			getSeed: function () {
				return seed;
			},
			rand: function () {
				// define the recurrence relationship
				z = (a * z + c) % m;
				// return a float in [0, 1)
				// if z = m then z / m = 0 therefore (z % m) / m < 1 always
				return z / m;
			}
		};
	})();

	lcg.setSeed(seed);
	perlin = new Array(PERLIN_SIZE + 1);
	for (var i = 0; i < PERLIN_SIZE + 1; i++) {
		perlin[i] = lcg.rand();
	}
};
exports._angleMode = RADIANS;
exports.acos = function (ratio) {
	return _fromRadians(Math.acos(ratio));
};
exports.asin = function (ratio) {
	return _fromRadians(Math.asin(ratio));
};
exports.atan = function (ratio) {
	return _fromRadians(Math.atan(ratio));
};
exports.atan2 = function (y, x) {
	return _fromRadians(Math.atan2(y, x));
};
exports.cos = function (angle) {
	return Math.cos(_toRadians(angle));
};
exports.sin = function (angle) {
	return Math.sin(_toRadians(angle));
};
exports.tan = function (angle) {
	return Math.tan(_toRadians(angle));
};
exports.degrees = function (angle) {
	return angle * RAD_TO_DEG;
};
exports.radians = function (angle) {
	return angle * DEG_TO_RAD;
};
exports.angleMode = function (mode) {
	if (mode === DEGREES || mode === RADIANS) {
		_angleMode = mode;
	}
};
exports._toRadians = function (angle) {
	if (_angleMode === DEGREES) {
		return angle * DEG_TO_RAD;
	}
	return angle;
};
exports._toDegrees = function (angle) {
	if (_angleMode === RADIANS) {
		return angle * RAD_TO_DEG;
	}
	return angle;
};
exports._fromRadians = function (angle) {
	if (_angleMode === DEGREES) {
		return angle * RAD_TO_DEG;
	}
	return angle;
};
