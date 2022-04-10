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

VGA_PALETTE = [
	[0, 0, 0, BLACK],
	[0, 0, 170, BLUE],
	[0, 170, 0, GREEN],
	[0, 170, 170, CYAN],
	[170, 0, 0, RED],
	[170, 0, 170, MAGENTA],
	[170, 85, 0, BROWN],
	[170, 170, 170, LIGHTGRAY],
	[85, 85, 85, DARKGRAY],
	[85, 85, 255, LIGHTBLUE],
	[85, 255, 64, LIGHTGREEN],
	[85, 255, 255, LIGHTCYAN],
	[255, 85, 85, LIGHTRED],
	[255, 85, 255, LIGHTMAGENTA],
	[255, 255, 85, YELLOW],
	[255, 255, 255, WHITE]
];


exports._background = VGA_PALETTE[0];
exports.ColorConversion = {};
exports.ColorConversion._hsbaToHSLA = function (hsba) {
	var hue = hsba[0];
	var sat = hsba[1];
	var val = hsba[2];

	// Calculate lightness.
	var li = (2 - sat) * val / 2;

	// Convert saturation.
	if (li !== 0) {
		if (li === 1) {
			sat = 0;
		} else if (li < 0.5) {
			sat = sat / (2 - sat);
		} else {
			sat = sat * val / (2 - li * 2);
		}
	}

	// Hue and alpha stay the same.
	return [hue, sat, li, hsba[3]];
};
exports.ColorConversion._hsbaToRGBA = function (hsba) {
	var hue = hsba[0] * 6; // We will split hue into 6 sectors.
	var sat = hsba[1];
	var val = hsba[2];

	var RGBA = [];

	if (sat === 0) {
		RGBA = [val, val, val, hsba[3]]; // Return early if grayscale.
	} else {
		var sector = Math.floor(hue);
		var tint1 = val * (1 - sat);
		var tint2 = val * (1 - sat * (hue - sector));
		var tint3 = val * (1 - sat * (1 + sector - hue));
		var red, green, blue;
		if (sector === 1) {
			// Yellow to green.
			red = tint2;
			green = val;
			blue = tint1;
		} else if (sector === 2) {
			// Green to cyan.
			red = tint1;
			green = val;
			blue = tint3;
		} else if (sector === 3) {
			// Cyan to blue.
			red = tint1;
			green = tint2;
			blue = val;
		} else if (sector === 4) {
			// Blue to magenta.
			red = tint3;
			green = tint1;
			blue = val;
		} else if (sector === 5) {
			// Magenta to red.
			red = val;
			green = tint1;
			blue = tint2;
		} else {
			// Red to yellow (sector could be 0 or 6).
			red = val;
			green = tint3;
			blue = tint1;
		}
		RGBA = [red, green, blue, hsba[3]];
	}

	return RGBA;
};
exports.ColorConversion._hslaToHSBA = function (hsla) {
	var hue = hsla[0];
	var sat = hsla[1];
	var li = hsla[2];

	// Calculate brightness.
	var val;
	if (li < 0.5) {
		val = (1 + sat) * li;
	} else {
		val = li + sat - li * sat;
	}

	// Convert saturation.
	sat = 2 * (val - li) / val;

	// Hue and alpha stay the same.
	return [hue, sat, val, hsla[3]];
};
exports.ColorConversion._hslaToRGBA = function (hsla) {
	var hue = hsla[0] * 6; // We will split hue into 6 sectors.
	var sat = hsla[1];
	var li = hsla[2];

	var RGBA = [];

	if (sat === 0) {
		RGBA = [li, li, li, hsla[3]]; // Return early if grayscale.
	} else {
		// Calculate brightness.
		var val;
		if (li < 0.5) {
			val = (1 + sat) * li;
		} else {
			val = li + sat - li * sat;
		}

		// Define zest.
		var zest = 2 * li - val;

		// Implement projection (project onto green by default).
		var hzvToRGB = function (hue, zest, val) {
			if (hue < 0) {
				// Hue must wrap to allow projection onto red and blue.
				hue += 6;
			} else if (hue >= 6) {
				hue -= 6;
			}
			if (hue < 1) {
				// Red to yellow (increasing green).
				return zest + (val - zest) * hue;
			} else if (hue < 3) {
				// Yellow to cyan (greatest green).
				return val;
			} else if (hue < 4) {
				// Cyan to blue (decreasing green).
				return zest + (val - zest) * (4 - hue);
			} else {
				// Blue to red (least green).
				return zest;
			}
		};

		// Perform projections, offsetting hue as necessary.
		RGBA = [
			hzvToRGB(hue + 2, zest, val),
			hzvToRGB(hue, zest, val),
			hzvToRGB(hue - 2, zest, val),
			hsla[3]
		];
	}

	return RGBA;
};
exports.ColorConversion._rgbaToHSBA = function (rgba) {
	var red = rgba[0];
	var green = rgba[1];
	var blue = rgba[2];

	var val = Math.max(red, green, blue);
	var chroma = val - Math.min(red, green, blue);

	var hue, sat;
	if (chroma === 0) {
		// Return early if grayscale.
		hue = 0;
		sat = 0;
	} else {
		sat = chroma / val;
		if (red === val) {
			// Magenta to yellow.
			hue = (green - blue) / chroma;
		} else if (green === val) {
			// Yellow to cyan.
			hue = 2 + (blue - red) / chroma;
		} else if (blue === val) {
			// Cyan to magenta.
			hue = 4 + (red - green) / chroma;
		}
		if (hue < 0) {
			// Confine hue to the interval [0, 1).
			hue += 6;
		} else if (hue >= 6) {
			hue -= 6;
		}
	}

	return [hue / 6, sat, val, rgba[3]];
};
exports.ColorConversion._rgbaToHSLA = function (rgba) {
	var red = rgba[0];
	var green = rgba[1];
	var blue = rgba[2];

	var val = Math.max(red, green, blue);
	var min = Math.min(red, green, blue);
	var li = val + min; // We will halve this later.
	var chroma = val - min;

	var hue, sat;
	if (chroma === 0) {
		// Return early if grayscale.
		hue = 0;
		sat = 0;
	} else {
		if (li < 1) {
			sat = chroma / li;
		} else {
			sat = chroma / (2 - li);
		}
		if (red === val) {
			// Magenta to yellow.
			hue = (green - blue) / chroma;
		} else if (green === val) {
			// Yellow to cyan.
			hue = 2 + (blue - red) / chroma;
		} else if (blue === val) {
			// Cyan to magenta.
			hue = 4 + (red - green) / chroma;
		}
		if (hue < 0) {
			// Confine hue to the interval [0, 1).
			hue += 6;
		} else if (hue >= 6) {
			hue -= 6;
		}
	}

	return [hue / 6, sat, li / 2, rgba[3]];
};

exports.p5Color = function (vals) {
	// Record color mode and maxes at time of construction.
	this._storeModeAndMaxes(_currentEnv._colorMode, _currentEnv._colorMaxes);

	// Calculate normalized RGBA values.
	if (
		this.mode !== RGB &&
		this.mode !== HSL &&
		this.mode !== HSB
	) {
		throw new Error(this.mode + ' is an invalid colorMode.');
	} else {
		this._array = p5Color._parseInputs.apply(this, vals);
	}

	// Expose closest screen color.
	this._calculateLevels();
	return this;
};
exports.p5Color.prototype.toAllegro = function () {
	// color distance function
	var dist = function (col1, col2) {
		delta_r = col1[0] - col2[0];
		delta_g = col1[1] - col2[1];
		delta_b = col1[2] - col2[2];
		return Math.sqrt(delta_r * delta_r + delta_g * delta_g + delta_b * delta_b);
	};

	var wanted = this.levels;
	var closest = 0;
	var mindist = dist(wanted, VGA_PALETTE[closest]);
	for (var i = 1; i < VGA_PALETTE.length; i++) {
		var currdist = dist(wanted, VGA_PALETTE[i]);
		if (currdist < mindist) {
			mindist = currdist;
			closest = i;
		}
	}

	return VGA_PALETTE[closest][3];
};
exports.p5Color.prototype.toString = function (format) {
	var a = this.levels;
	var f = this._array;
	var alpha = f[3]; // String representation uses normalized alpha

	switch (format) {
		case '#rrggbb':
			return '#'.concat(
				a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
				a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
				a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16)
			);

		case '#rrggbbaa':
			return '#'.concat(
				a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
				a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
				a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16),
				a[3] < 16 ? '0'.concat(a[2].toString(16)) : a[3].toString(16)
			);

		case '#rgb':
			return '#'.concat(
				Math.round(f[0] * 15).toString(16),
				Math.round(f[1] * 15).toString(16),
				Math.round(f[2] * 15).toString(16)
			);

		case '#rgba':
			return '#'.concat(
				Math.round(f[0] * 15).toString(16),
				Math.round(f[1] * 15).toString(16),
				Math.round(f[2] * 15).toString(16),
				Math.round(f[3] * 15).toString(16)
			);

		case 'rgb':
			return 'rgb('.concat(a[0], ', ', a[1], ', ', a[2], ')');

		case 'rgb%':
			return 'rgb('.concat(
				(100 * f[0]).toPrecision(3),
				'%, ',
				(100 * f[1]).toPrecision(3),
				'%, ',
				(100 * f[2]).toPrecision(3),
				'%)'
			);

		case 'rgba%':
			return 'rgba('.concat(
				(100 * f[0]).toPrecision(3),
				'%, ',
				(100 * f[1]).toPrecision(3),
				'%, ',
				(100 * f[2]).toPrecision(3),
				'%, ',
				(100 * f[3]).toPrecision(3),
				'%)'
			);

		case 'hsb':
		case 'hsv':
			if (!this.hsba) this.hsba = ColorConversion._rgbaToHSBA(this._array);
			return 'hsb('.concat(
				this.hsba[0] * this.maxes[HSB][0],
				', ',
				this.hsba[1] * this.maxes[HSB][1],
				', ',
				this.hsba[2] * this.maxes[HSB][2],
				')'
			);

		case 'hsb%':
		case 'hsv%':
			if (!this.hsba) this.hsba = ColorConversion._rgbaToHSBA(this._array);
			return 'hsb('.concat(
				(100 * this.hsba[0]).toPrecision(3),
				'%, ',
				(100 * this.hsba[1]).toPrecision(3),
				'%, ',
				(100 * this.hsba[2]).toPrecision(3),
				'%)'
			);

		case 'hsba':
		case 'hsva':
			if (!this.hsba) this.hsba = ColorConversion._rgbaToHSBA(this._array);
			return 'hsba('.concat(
				this.hsba[0] * this.maxes[HSB][0],
				', ',
				this.hsba[1] * this.maxes[HSB][1],
				', ',
				this.hsba[2] * this.maxes[HSB][2],
				', ',
				alpha,
				')'
			);

		case 'hsba%':
		case 'hsva%':
			if (!this.hsba) this.hsba = ColorConversion._rgbaToHSBA(this._array);
			return 'hsba('.concat(
				(100 * this.hsba[0]).toPrecision(3),
				'%, ',
				(100 * this.hsba[1]).toPrecision(3),
				'%, ',
				(100 * this.hsba[2]).toPrecision(3),
				'%, ',
				(100 * alpha).toPrecision(3),
				'%)'
			);

		case 'hsl':
			if (!this.hsla) this.hsla = ColorConversion._rgbaToHSLA(this._array);
			return 'hsl('.concat(
				this.hsla[0] * this.maxes[HSL][0],
				', ',
				this.hsla[1] * this.maxes[HSL][1],
				', ',
				this.hsla[2] * this.maxes[HSL][2],
				')'
			);

		case 'hsl%':
			if (!this.hsla) this.hsla = ColorConversion._rgbaToHSLA(this._array);
			return 'hsl('.concat(
				(100 * this.hsla[0]).toPrecision(3),
				'%, ',
				(100 * this.hsla[1]).toPrecision(3),
				'%, ',
				(100 * this.hsla[2]).toPrecision(3),
				'%)'
			);

		case 'hsla':
			if (!this.hsla) this.hsla = ColorConversion._rgbaToHSLA(this._array);
			return 'hsla('.concat(
				this.hsla[0] * this.maxes[HSL][0],
				', ',
				this.hsla[1] * this.maxes[HSL][1],
				', ',
				this.hsla[2] * this.maxes[HSL][2],
				', ',
				alpha,
				')'
			);

		case 'hsla%':
			if (!this.hsla) this.hsla = ColorConversion._rgbaToHSLA(this._array);
			return 'hsl('.concat(
				(100 * this.hsla[0]).toPrecision(3),
				'%, ',
				(100 * this.hsla[1]).toPrecision(3),
				'%, ',
				(100 * this.hsla[2]).toPrecision(3),
				'%, ',
				(100 * alpha).toPrecision(3),
				'%)'
			);

		case 'rgba':
		default:
			return 'rgba('.concat(a[0], ',', a[1], ',', a[2], ',', alpha, ')');
	}
};
exports.p5Color.prototype.setRed = function (new_red) {
	this._array[0] = new_red / this.maxes[RGB][0];
	this._calculateLevels();
};
exports.p5Color.prototype.setGreen = function (new_green) {
	this._array[1] = new_green / this.maxes[RGB][1];
	this._calculateLevels();
};
exports.p5Color.prototype.setBlue = function (new_blue) {
	this._array[2] = new_blue / this.maxes[RGB][2];
	this._calculateLevels();
};
exports.p5Color.prototype.setAlpha = function (new_alpha) {
	this._array[3] = new_alpha / this.maxes[this.mode][3];
	this._calculateLevels();
};
exports.p5Color.prototype._calculateLevels = function () {
	var array = this._array;
	// (loop backwards for performance)
	var levels = (this.levels = new Array(array.length));
	for (var i = array.length - 1; i >= 0; --i) {
		levels[i] = Math.round(array[i] * 255);
	}
};
exports.p5Color.prototype._getAlpha = function () {
	return this._array[3] * this.maxes[this.mode][3];
};
exports.p5Color.prototype._storeModeAndMaxes = function (new_mode, new_maxes) {
	this.mode = new_mode;
	this.maxes = new_maxes;
};
exports.p5Color.prototype._getMode = function () {
	return this.mode;
};
exports.p5Color.prototype._getMaxes = function () {
	return this.maxes;
};
exports.p5Color.prototype._getBlue = function () {
	return this._array[2] * this.maxes[RGB][2];
};
exports.p5Color.prototype._getBrightness = function () {
	if (!this.hsba) {
		this.hsba = ColorConversion._rgbaToHSBA(this._array);
	}
	return this.hsba[2] * this.maxes[HSB][2];
};
exports.p5Color.prototype._getGreen = function () {
	return this._array[1] * this.maxes[RGB][1];
};
exports.p5Color.prototype._getHue = function () {
	if (this.mode === HSB) {
		if (!this.hsba) {
			this.hsba = ColorConversion._rgbaToHSBA(this._array);
		}
		return this.hsba[0] * this.maxes[HSB][0];
	} else {
		if (!this.hsla) {
			this.hsla = ColorConversion._rgbaToHSLA(this._array);
		}
		return this.hsla[0] * this.maxes[HSL][0];
	}
};
exports.p5Color.prototype._getLightness = function () {
	if (!this.hsla) {
		this.hsla = ColorConversion._rgbaToHSLA(this._array);
	}
	return this.hsla[2] * this.maxes[HSL][2];
};
exports.p5Color.prototype._getRed = function () {
	return this._array[0] * this.maxes[RGB][0];
};
exports.p5Color.prototype._getSaturation = function () {
	if (this.mode === HSB) {
		if (!this.hsba) {
			this.hsba = ColorConversion._rgbaToHSBA(this._array);
		}
		return this.hsba[1] * this.maxes[HSB][1];
	} else {
		if (!this.hsla) {
			this.hsla = ColorConversion._rgbaToHSLA(this._array);
		}
		return this.hsla[1] * this.maxes[HSL][1];
	}
};
var namedColors = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkgrey: '#a9a9a9',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkslategrey: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dimgrey: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	grey: '#808080',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgray: '#d3d3d3',
	lightgreen: '#90ee90',
	lightgrey: '#d3d3d3',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightslategrey: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	slategrey: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32'
};
var WHITESPACE = /\s*/; // Match zero or more whitespace characters.
var INTEGER = /(\d{1,3})/; // Match integers: 79, 255, etc.
var DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/; // Match 129.6, 79, .9, etc.
var PERCENT = new RegExp(DECIMAL.source + '%'); // Match 12.9%, 79%, .9%, etc.
var colorPatterns = {
	// Match colors in format #XXX, e.g. #416.
	HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,

	// Match colors in format #XXXX, e.g. #5123.
	HEX4: /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,

	// Match colors in format #XXXXXX, e.g. #b4d455.
	HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

	// Match colors in format #XXXXXXXX, e.g. #b4d45535.
	HEX8: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

	// Match colors in format rgb(R, G, B), e.g. rgb(255, 0, 128).
	RGB: new RegExp(
		[
			'^rgb\\(',
			INTEGER.source,
			',',
			INTEGER.source,
			',',
			INTEGER.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format rgb(R%, G%, B%), e.g. rgb(100%, 0%, 28.9%).
	RGB_PERCENT: new RegExp(
		[
			'^rgb\\(',
			PERCENT.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format rgb(R, G, B, A), e.g. rgb(255, 0, 128, 0.25).
	RGBA: new RegExp(
		[
			'^rgba\\(',
			INTEGER.source,
			',',
			INTEGER.source,
			',',
			INTEGER.source,
			',',
			DECIMAL.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format rgb(R%, G%, B%, A), e.g. rgb(100%, 0%, 28.9%, 0.5).
	RGBA_PERCENT: new RegExp(
		[
			'^rgba\\(',
			PERCENT.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			',',
			DECIMAL.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format hsla(H, S%, L%), e.g. hsl(100, 40%, 28.9%).
	HSL: new RegExp(
		[
			'^hsl\\(',
			INTEGER.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format hsla(H, S%, L%, A), e.g. hsla(100, 40%, 28.9%, 0.5).
	HSLA: new RegExp(
		[
			'^hsla\\(',
			INTEGER.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			',',
			DECIMAL.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format hsb(H, S%, B%), e.g. hsb(100, 40%, 28.9%).
	HSB: new RegExp(
		[
			'^hsb\\(',
			INTEGER.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	),

	// Match colors in format hsba(H, S%, B%, A), e.g. hsba(100, 40%, 28.9%, 0.5).
	HSBA: new RegExp(
		[
			'^hsba\\(',
			INTEGER.source,
			',',
			PERCENT.source,
			',',
			PERCENT.source,
			',',
			DECIMAL.source,
			'\\)$'
		].join(WHITESPACE.source),
		'i'
	)
};
exports.p5Color._parseInputs = function (r, g, b, a) {
	var numArgs = arguments.length;
	var mode = this.mode;
	var maxes = this.maxes[mode];
	var results = [];
	var i;

	if (numArgs >= 3) {
		// Argument is a list of component values.

		results[0] = r / maxes[0];
		results[1] = g / maxes[1];
		results[2] = b / maxes[2];

		// Alpha may be undefined, so default it to 100%.
		if (typeof a === 'number') {
			results[3] = a / maxes[3];
		} else {
			results[3] = 1;
		}

		// Constrain components to the range [0,1].
		// (loop backwards for performance)
		for (i = results.length - 1; i >= 0; --i) {
			var result = results[i];
			if (result < 0) {
				results[i] = 0;
			} else if (result > 1) {
				results[i] = 1;
			}
		}

		// Convert to RGBA and return.
		if (mode === HSL) {
			return ColorConversion._hslaToRGBA(results);
		} else if (mode === HSB) {
			return ColorConversion._hsbaToRGBA(results);
		} else {
			return results;
		}
	} else if (numArgs === 1 && typeof r === 'string') {
		var str = r.trim().toLowerCase();

		// Return if string is a named colour.
		if (namedColors[str]) {
			return p5Color._parseInputs.call(this, namedColors[str]);
		}

		// Try RGBA pattern matching.
		if (colorPatterns.HEX3.test(str)) {
			// #rgb
			results = colorPatterns.HEX3.exec(str)
				.slice(1)
				.map(function (color) {
					return parseInt(color + color, 16) / 255;
				});
			results[3] = 1;
			return results;
		} else if (colorPatterns.HEX6.test(str)) {
			// #rrggbb
			results = colorPatterns.HEX6.exec(str)
				.slice(1)
				.map(function (color) {
					return parseInt(color, 16) / 255;
				});
			results[3] = 1;
			return results;
		} else if (colorPatterns.HEX4.test(str)) {
			// #rgba
			results = colorPatterns.HEX4.exec(str)
				.slice(1)
				.map(function (color) {
					return parseInt(color + color, 16) / 255;
				});
			return results;
		} else if (colorPatterns.HEX8.test(str)) {
			// #rrggbbaa
			results = colorPatterns.HEX8.exec(str)
				.slice(1)
				.map(function (color) {
					return parseInt(color, 16) / 255;
				});
			return results;
		} else if (colorPatterns.RGB.test(str)) {
			// rgb(R,G,B)
			results = colorPatterns.RGB.exec(str)
				.slice(1)
				.map(function (color) {
					return color / 255;
				});
			results[3] = 1;
			return results;
		} else if (colorPatterns.RGB_PERCENT.test(str)) {
			// rgb(R%,G%,B%)
			results = colorPatterns.RGB_PERCENT.exec(str)
				.slice(1)
				.map(function (color) {
					return parseFloat(color) / 100;
				});
			results[3] = 1;
			return results;
		} else if (colorPatterns.RGBA.test(str)) {
			// rgba(R,G,B,A)
			results = colorPatterns.RGBA.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 3) {
						return parseFloat(color);
					}
					return color / 255;
				});
			return results;
		} else if (colorPatterns.RGBA_PERCENT.test(str)) {
			// rgba(R%,G%,B%,A%)
			results = colorPatterns.RGBA_PERCENT.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 3) {
						return parseFloat(color);
					}
					return parseFloat(color) / 100;
				});
			return results;
		}

		// Try HSLA pattern matching.
		if (colorPatterns.HSL.test(str)) {
			// hsl(H,S,L)
			results = colorPatterns.HSL.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 0) {
						return parseInt(color, 10) / 360;
					}
					return parseInt(color, 10) / 100;
				});
			results[3] = 1;
		} else if (colorPatterns.HSLA.test(str)) {
			// hsla(H,S,L,A)
			results = colorPatterns.HSLA.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 0) {
						return parseInt(color, 10) / 360;
					} else if (idx === 3) {
						return parseFloat(color);
					}
					return parseInt(color, 10) / 100;
				});
		}
		results = results.map(function (value) {
			return Math.max(Math.min(value, 1), 0);
		});
		if (results.length) {
			return ColorConversion._hslaToRGBA(results);
		}

		// Try HSBA pattern matching.
		if (colorPatterns.HSB.test(str)) {
			// hsb(H,S,B)
			results = colorPatterns.HSB.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 0) {
						return parseInt(color, 10) / 360;
					}
					return parseInt(color, 10) / 100;
				});
			results[3] = 1;
		} else if (colorPatterns.HSBA.test(str)) {
			// hsba(H,S,B,A)
			results = colorPatterns.HSBA.exec(str)
				.slice(1)
				.map(function (color, idx) {
					if (idx === 0) {
						return parseInt(color, 10) / 360;
					} else if (idx === 3) {
						return parseFloat(color);
					}
					return parseInt(color, 10) / 100;
				});
		}

		if (results.length) {
			// (loop backwards for performance)
			for (i = results.length - 1; i >= 0; --i) {
				results[i] = Math.max(Math.min(results[i], 1), 0);
			}

			return ColorConversion._hsbaToRGBA(results);
		}

		// Input did not match any CSS color pattern: default to white.
		results = [1, 1, 1, 1];
	} else if ((numArgs === 1 || numArgs === 2) && typeof r === 'number') {
		// 'Grayscale' mode.

		/**
		 * For HSB and HSL, interpret the gray level as a brightness/lightness
		 * value (they are equivalent when chroma is zero). For RGB, normalize the
		 * gray level according to the blue maximum.
		 */
		results[0] = r / maxes[2];
		results[1] = r / maxes[2];
		results[2] = r / maxes[2];

		// Alpha may be undefined, so default it to 100%.
		if (typeof g === 'number') {
			results[3] = g / maxes[3];
		} else {
			results[3] = 1;
		}

		// Constrain components to the range [0,1].
		results = results.map(function (value) {
			return Math.max(Math.min(value, 1), 0);
		});
	} else {
		throw new Error(arguments + 'is not a valid color representation.');
	}

	return results;
};
exports.alpha = function (c) {
	return color(c)._getAlpha();
};
exports.blue = function (c) {
	return color(c)._getBlue();
};
exports.brightness = function (c) {
	return color(c)._getBrightness();
};
exports.color = function () {
	if (arguments[0] instanceof p5Color) {
		return arguments[0]; // Do nothing if argument is already a color object.
	}

	var args = arguments[0] instanceof Array ? arguments[0] : arguments;
	return new p5Color(args);
};
exports.green = function (c) {
	return color(c)._getGreen();
};
exports.hue = function (c) {
	return color(c)._getHue();
};
exports.lerpColor = function (c1, c2, amt) {
	var mode = _currentEnv._colorMode;
	var maxes = _currentEnv._colorMaxes;
	var l0, l1, l2, l3;
	var fromArray, toArray;

	if (mode === RGB) {
		fromArray = c1.levels.map(function (level) {
			return level / 255;
		});
		toArray = c2.levels.map(function (level) {
			return level / 255;
		});
	} else if (mode === HSB) {
		c1._getBrightness(); // Cache hsba so it definitely exists.
		c2._getBrightness();
		fromArray = c1.hsba;
		toArray = c2.hsba;
	} else if (mode === HSL) {
		c1._getLightness(); // Cache hsla so it definitely exists.
		c2._getLightness();
		fromArray = c1.hsla;
		toArray = c2.hsla;
	} else {
		throw new Error(mode + 'cannot be used for interpolation.');
	}

	// Prevent extrapolation.
	amt = Math.max(Math.min(amt, 1), 0);

	// Define lerp here itself if user isn't using math module.
	// Maintains the definition as found in math/calculation.js
	if (typeof this.lerp === 'undefined') {
		this.lerp = function (start, stop, amt) {
			return amt * (stop - start) + start;
		};
	}

	// Perform interpolation.
	l0 = this.lerp(fromArray[0], toArray[0], amt);
	l1 = this.lerp(fromArray[1], toArray[1], amt);
	l2 = this.lerp(fromArray[2], toArray[2], amt);
	l3 = this.lerp(fromArray[3], toArray[3], amt);

	// Scale components.
	l0 *= maxes[mode][0];
	l1 *= maxes[mode][1];
	l2 *= maxes[mode][2];
	l3 *= maxes[mode][3];

	return color(l0, l1, l2, l3);
};
exports.lightness = function (c) {
	return color(c)._getLightness();
};
exports.red = function (c) {
	return color(c)._getRed();
};
exports.saturation = function (c) {
	return color(c)._getSaturation();
};
exports.background = function () {
	if (arguments[0] instanceof p5Color) {
		_background = arguments[0].toAllegro()
	} else {
		_background = new p5Color(arguments).toAllegro();
	}
	global.__screen__.TextColor(_background);
	global.__screen__.TextBackground(_background);
	global.__screen__.Clear();
};
exports.clear = exports.background;

exports.colorMode = function (mode, max1, max2, max3, maxA) {
	if (
		mode === RGB ||
		mode === HSB ||
		mode === HSL
	) {
		// Set color mode.
		_currentEnv._colorMode = mode;

		// Set color maxes.
		var maxes = _currentEnv._colorMaxes[mode];
		if (arguments.length === 2) {
			maxes[0] = max1; // Red
			maxes[1] = max1; // Green
			maxes[2] = max1; // Blue
			maxes[3] = max1; // Alpha
		} else if (arguments.length === 4) {
			maxes[0] = max1; // Red
			maxes[1] = max2; // Green
			maxes[2] = max3; // Blue
		} else if (arguments.length === 5) {
			maxes[0] = max1; // Red
			maxes[1] = max2; // Green
			maxes[2] = max3; // Blue
			maxes[3] = maxA; // Alpha
		}
	}
};
exports.fill = function () {
	if (arguments[0] instanceof p5Color) {
		_currentEnv._fill = arguments[0].toAllegro();
	} else {
		_currentEnv._fill = new p5Color(arguments).toAllegro();
	}
};
exports.noFill = function () {
	_currentEnv._fill = NO_COLOR;
};
exports.noStroke = function () {
	_currentEnv._stroke = NO_COLOR;
};
exports.stroke = function () {
	if (arguments[0] instanceof p5Color) {
		_currentEnv._stroke = arguments[0].toAllegro()
	} else {
		_currentEnv._stroke = new p5Color(arguments).toAllegro();
	}
};
