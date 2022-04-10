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

Include('p5const');
Include('p5color');
Include('p5env');
Include('p5input');
Include('p5math');
Include('p5shape');
// Include('p5typo');
Include('p5util');
Include('p5vect');
Include('p5trans');

exports._ONE_LINE = "";

/*
 * not documented here.
 */
function Setup() {
	TextMode(C4350);		// switch to 80x50 color mode
	IntenseVideo();			// disable blinking for 16 BG colors
	EnableScrolling(false);	// disable scrolling

	windowWidth = displayWidth = width = ScreenCols();
	windowHeight = displayHeight = height = ScreenRows();
	frameCount = 0;
	_hasMouseInteracted = false;
	mouseX = pmouseX = winMouseX = pwinMouseX = 0;
	mouseY = pmouseY = winMouseY = pwinMouseY = 0;
	frameRate(30);

	for (var i = 0; i < width; i++) {
		_ONE_LINE += " ";
	}

	global.__screen__ = new Screen();

	setup();
};

/*
 * not documented here.
 */
function Loop() {
	if (_loop) {
		redraw();
	}
	if (keyIsPressed) {
		keyIsPressed = false;
		if (typeof global['keyReleased'] != 'undefined') {
			keyReleased();
		}
	}
};

/*
 * not documented here.
 */
function Input(ekey) {
	if (ekey != -1) {
		key = ekey & 0xFF;	// TODO:
		keyCode = ekey;	// TODO:
		if (typeof global['keyPressed'] != 'undefined') {
			keyPressed(e);
		}
		if (typeof global['keyTyped'] != 'undefined') {
			keyTyped(e);
		}
		keyIsPressed = true;
	}
};


exports.__VERSION__ = 2;

exports._loop = true;
exports._lastButtons = 0;

exports._env = [];
exports._currentEnv = {
	_fill: WHITE,
	_stroke: BLACK,
	_colorMode: RGB,
	_colorMaxes: {
		rgb: [255, 255, 255, 255],
		hsb: [360, 100, 100, 1],
		hsl: [360, 100, 100, 1]
	},
	_txtAlignX: LEFT,
	_txtAlignY: TOP,
	_rectMode: CORNER,
	_ellipseMode: CENTER,
	_matrix: null
};

exports._cloneEnv = function () {
	if (_currentEnv._matrix) {
		// deep copy matrix
		var matrix = [
			_currentEnv._matrix[0].slice(0),
			_currentEnv._matrix[1].slice(0),
			_currentEnv._matrix[2].slice(0)
		]
	} else {
		var matrix = null;
	}

	return {
		_fill: _currentEnv._fill,
		_stroke: _currentEnv._stroke,
		_colorMode: _currentEnv._colorMode,
		_colorMaxes: {
			// deep copy color settings
			rgb: _currentEnv._colorMaxes.rgb.slice(0),
			hsb: _currentEnv._colorMaxes.hsb.slice(0),
			hsl: _currentEnv._colorMaxes.hsl.slice(0)
		},
		_txtAlignX: _currentEnv._txtAlignX,
		_txtAlignY: _currentEnv._txtAlignY,
		_font: _currentEnv._font,
		_rectMode: _currentEnv._rectMode,
		_ellipseMode: _currentEnv._ellipseMode,
		_imageMode: _currentEnv._imageMode,
		_strokeWeight: _currentEnv._strokeWeight,
		_matrix: matrix
	};
}

exports.exit = function () {
	TextColor(LIGHTGRAY);
	TextBackground(BLACK);
	ClearScreen();
	Quit();
};

exports.loop = function () {
	_loop = true;
};

exports.noLoop = function () {
	_loop = false;
};

exports.redraw = function () {
	resetMatrix();	// TODO: fix!
	draw();
	global.__screen__.ToDisplay();
	frameCount++;
};

exports.displayDensity = function () {
	return 1;
};


exports.delay = function (ms) {
	Sleep(ms);
};

exports.printArray = function (what) {
	for (var i = 0; i < what.length; i++) {
		Println("[" + i + "] " + what[i]);
	}
};

exports.saveStrings = function (fname, data) {
	var f = new File();
	data.forEach(function (d) {
		f.WriteLine(d);
	});
	f.Close();
};

exports.saveBytes = function (fname, data) {
	var f = new File();
	data.forEach(function (d) {
		f.WriteByte(d);
	});
	f.Close();
};

exports.loadStrings = function (fname) {
	try {
		var ret = [];
		var f = new File(fname);
		var l = f.ReadLine();
		while (l != null) {
			ret.push(l);
			l = f.ReadLine();
		}
		f.Close();
		return ret;
	} catch (e) {
		Println(e);
		return null;
	}
};

exports.loadBytes = function (fname) {
	try {
		var ret = [];
		var f = new File(fname);
		var ch = g.ReadByte();
		while (ch != null) {
			ret.push(ch);
			ch = f.ReadByte();
		}
		f.Close();
		return ret;
	} catch (e) {
		Println(e);
		return null;
	}
};

exports.push = function () {
	_env.push(_cloneEnv());
};

exports.pop = function () {
	if (_env.length > 0) {
		_currentEnv = _env.pop();
	} else {
		console.warn('pop() was called without matching push()');
	}
};

exports.blendMode = function (mode) { };
exports.cursor = function () { };
exports.noCursor = function () { };
exports.size = function () { };
exports.createCanvas = function () { };
exports.smooth = function () { };
exports.noSmooth = function () { };
exports.settings = function () { };
exports.tint = function () { };
exports.noTint = function () { };

// push this to global as "Include()" will not return to do it for us
for (var key in exports) {
	global[key] = exports[key];
}

// entry point
Setup();
while (true) {
	var start = MsecTime();
	if (KbHit()) {
		var keyCode = GetXKey();
		if (keyCode === K_Escape) {
			exit();
		}
		Input(keyCode);
	}
	Loop();
	var end = MsecTime();
	var runtime = (end - start) + 1;

	_current_frameRate = 1000 / runtime;
	if (_current_frameRate > _wanted_frameRate) {
		var delay = (1000 / _wanted_frameRate) - runtime;
		Sleep(delay);
	}
	end = MsecTime();
	runtime = (end - start) + 1;
	_current_frameRate = 1000 / runtime;
}
