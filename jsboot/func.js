/*
MIT License

Copyright (c) 2019-2020 Andre Seidelt <superilu@yahoo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
Additional code taken from MDN:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

Code samples added on or after August 20, 2010 are in the public domain (CC0). 
No licensing notice is necessary, but if you need one, you can use: 
"Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/".
*/

/**
 * @property {boolean} DEBUG enable/disable Debug() output.
 */
DEBUG = true;

/**
 * @property {string} ZIP_DELIM delimiter between ZIP filename and entry name.
 */
ZIP_DELIM = "=";

/**
 * @property {number} RAW_HDD_FLAG index for HDDs when using raw disk functions.
 */
RAW_HDD_FLAG = 0x80;

/**
 * @property {number} RAW_BLOCKSIZE size of sectors when reading/writing raw disks.
 */
RAW_BLOCKSIZE = 512;

/**
 * try a specific filename which can ba a plain file or a ZIP-file entry. Throws an Exception if the file cant be read.
 * 
 * @param {string} name module name.
 * @param {string} fname the file name to try.
 * 
 * @returns the imported module.
 */
function RequireFile(name, fname) {
	var content;
	if (fname.indexOf(ZIP_DELIM) != -1) {
		var parts = fname.split(ZIP_DELIM);
		var zname = parts[0];
		var ename = parts[1];
		Debugln("Require(zip) " + zname + " -> " + ename);

		content = ReadZIP(zname, ename);
	} else {
		content = Read(fname);
	}
	var exports = {};
	Require._cache[name] = exports;
	NamedFunction('exports', content, name)(exports);
	return exports;
}

/**
 * import a module. DOjS modules must put all exported symbols into an object called 'exports'.
 * @example
 * exports.myVar = 0;               // will be exported
 * exports.myFunc = function() {};  // will also be exported
 * var localVar;                    // will only be accessible in the module
 * function localFunction() {};     // will also only be accessible in the module
 * @param {string} name module file name.
 * @returns the imported module.
 */
function Require(name) {
	// look in cache
	if (name in Require._cache) {
		Debugln("Require(cached) " + name);
		return Require._cache[name];
	}

	var names = [
		name,
		name + '.js',
		'jsboot.zip=jsboot/' + name,
		'jsboot.zip=jsboot/' + name + '.js',
		'jsboot/' + name,
		'jsboot/' + name + '.js'
	];
	Debugln("Require(names) " + JSON.stringify(names));

	for (var i = 0; i < names.length; i++) {
		var n = names[i];
		Debugln("Require() Trying '" + n + "'");
		try {
			return RequireFile(name, n);
		} catch (e) {
			Debugln("RequireFile() " + n + " Not found" + e);
			continue;
		}
	}

	throw 'Could not load "' + name + '"';
}
Require._cache = Object.create(null);

/**
 * include a module. The exported functions are copied into global scope.
 * @see {@link Require}
 * @param {string} name module file name.
 */
function Include(name) {
	var e = Require(name);
	for (var key in e) {
		Debugln("Include(toGlobal) " + key);
		global[key] = e[key];
	}
}

/**
 * add toString() to Error class.
 */
Error.prototype.toString = function () {
	if (this.stackTrace) { return this.name + ': ' + this.message + this.stackTrace; }
	return this.name + ': ' + this.message;
};

/**
 * print startup info with screen details.
 */
function StartupInfo() {
	if (DEBUG) {
		Debugln("Memory: " + JSON.stringify(MemoryInfo()));
		Debugln("Command line args: " + JSON.stringify(args));
		Debugln("SerialPorts: " + JSON.stringify(GetSerialPorts().map(function (e) { return "0x" + e.toString(16) })));
		Debugln("ParallelPorts: " + JSON.stringify(GetParallelPorts().map(function (e) { return "0x" + e.toString(16) })));
		Debugln("FDD: " + GetNumberOfFDD() + ", HDD: " + GetNumberOfHDD());

		var funcs = [];
		var other = [];
		for (var e in global) {
			if (typeof global[e] === "function") {
				funcs.push(e + "()");
			} else {
				other.push(e);
			}
		}
		funcs.sort();
		other.sort();
		Debugln("Known globals:");
		for (var i = 0; i < other.length; i++) {
			Debugln("    " + other[i]);
		}
		Debugln("Known functions:");
		for (var i = 0; i < funcs.length; i++) {
			Debugln("    " + funcs[i]);
		}
	}
}

/**
 * get char code.
 * 
 * @param {string} s a string
 * @returns the ASCII-code of the first character.
 */
function CharCode(s) {
	return s.charCodeAt(0);
}

/**
 * get random integer between min and max (or between 0 and min if max is not provided).
 * 
 * @param {number} min min
 * @param {number} max max
 * 
 * @returns {number} an integer between min and max.
 */
function RandomInt(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	return Math.floor(Math.random() * (max - min) + min);
}

// add startsWith() endsWith() to String class
if (!String.prototype.startsWith) {
	Object.defineProperty(String.prototype, 'startsWith', {
		value: function (search, rawPos) {
			var pos = rawPos > 0 ? rawPos | 0 : 0;
			return this.substring(pos, pos + search.length) === search;
		}
	});
}
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}

/**
 * create stop watch for benchmarking
 */
function StopWatch() {
	this.Reset();
};
/**
 * start stopwatch.
 */
StopWatch.prototype.Start = function () {
	this.start = MsecTime();
	this.stop = null;
};
/**
 * stop stopwatch.
 */
StopWatch.prototype.Stop = function () {
	this.stop = MsecTime();
	if (!this.start) {
		this.Reset();
		throw "StopWatch.Stop() called before StopWatch.Start()!"
	}
};
/**
 * reset stopwatch.
 */
StopWatch.prototype.Reset = function () {
	this.start = null;
	this.stop = null;
};
/**
 * get runtime in ms.
 * @returns {number} runtime in ms.
 */
StopWatch.prototype.ResultMs = function () {
	if (!this.start || !this.stop) {
		throw "start or end time missing!";
	}
	return this.stop - this.start;
};
/**
* convert result to a readable string.
* 
* @param {string} [name] name of the measured value.
*
* @returns {string} a string describing the runtime.
*/
StopWatch.prototype.Result = function (name) {
	var total = this.ResultMs();

	var ret = "Runtime is ";
	if (name) {
		ret = "Runtime for '" + name + "' is ";
	}


	var msecs = Math.floor(total % 1000);
	var secs = Math.floor((total / 1000) % 60);
	var mins = Math.floor((total / 1000 / 60));

	if (mins) {
		ret += mins + "m ";
	}
	if (secs) {
		ret += secs + "s ";
	}
	ret += msecs + "ms";

	return ret;
};
/**
 * print result as a readable string.
 * 
 * @param {string} [name] name of the measured value.
 */
StopWatch.prototype.Print = function (name) {
	Println(this.Result(name));
};

/**
 * Write the given value to io-port 80h to be displayed by a POST card.
 * 
 * @param {number} val value to write to 0x80.
 */
function POST(val) {
	OutPortByte(0x80, val);
}

/*
see:
https://en.wikipedia.org/wiki/Parallel_port
http://electrosofts.com/parallel/
https://web.archive.org/web/20120301022928/http://retired.beyondlogic.org/spp/parallel.pdf
https://stanislavs.org/helppc/bios_data_area.html
*/

var _lptPorts = GetParallelPorts();

/**
 * read/write data to LPT data register.
 * 
 * @param {number} port port number (0-3).
 * @param {number} data data to write, null to read
 * 
 * @returns {number} current LPT value if data was null.
 * 
 * @see GetParallelPorts
 */
function LPTRawData(port, data) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	var addr = _lptPorts[port];

	var old = InPortByte(addr + PARALLEL.CONTROL.ADDR);
	if (data) {
		OutPortByte(addr + PARALLEL.CONTROL.ADDR, old & ~PARALLEL.CONTROL.BIDI);

		OutPortByte(addr + PARALLEL.DATA.ADDR, data);
	} else {
		OutPortByte(addr + PARALLEL.CONTROL.ADDR, old | PARALLEL.CONTROL.BIDI);

		return InPortByte(addr + PARALLEL.DATA.ADDR);
	}
}

/**
 * read status register of LPT port.
 * 
 * @param {number} port port number (0-3).
 * 
 * @see GetParallelPorts
 */
function LPTRawStatus(port) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	var addr = _lptPorts[port];

	return InPortByte(addr + PARALLEL.STATUS.ADDR);
}

/**
 * write bits to LPT control register.
 * 
 * @param {number} port port number (0-3).
 * @param {number} bits data to write
 * 
 * @see GetParallelPorts
 */
function LPTRawControl(port, bits) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	var addr = _lptPorts[port];

	OutPortByte(addr + PARALLEL.CONTROL.ADDR, bits);
}

/**
 * reset parallel port.
 * @param {number} port port number (0-3).
 * 
 * @see GetParallelPorts
 */
function LPTReset(port) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	_LPTReset(port);
}

/**
 * send data to parallel port.
 * @param {number} port port number (0-3).
 * @param {string} data data to transfer.
 * 
 * @see GetParallelPorts
 */
function LPTSend(port, data) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	_LPTSend(port, data);
}

/**
 * read parallel port status.
 * @param {number} port port number (0-3).
 * 
 * @see GetParallelPorts
 */
function LPTStatus(port) {
	if (port < 0 && ports >= _lptPorts.length) {
		throw 'LPT port out of range';
	}
	return _LPTStatus(port);
}

/**
 * parallel port IO register definitions.
 * 
 *  [*] CONTROL.BIDI must be set to 1 in order to read from DATA. Not supported by all ports!
 * 
 * @property {*} DATA.BIT0 Data 0, pin 2 (out/in*)
 * @property {*} DATA.BIT1 Data 1, pin 3 (out/in*)
 * @property {*} DATA.BIT2 Data 2, pin 4 (out/in*)
 * @property {*} DATA.BIT3 Data 3, pin 5 (out/in*)
 * @property {*} DATA.BIT4 Data 4, pin 6 (out/in*)
 * @property {*} DATA.BIT5 Data 5, pin 7 (out/in*)
 * @property {*} DATA.BIT6 Data 6, pin 8 (out/in*)
 * @property {*} DATA.BIT7 Data 7, pin 9 (out/in*)
 * 
 * @property {*} STATUS.BUSY pin 11, inverted (in)
 * @property {*} STATUS.ACK pin 10 (in)
 * @property {*} STATUS.PAPER_OUT pin 12 (in)
 * @property {*} STATUS.SELECT_IN pin 13 (in)
 * @property {*} STATUS.ERROR pin 15 (in)
 * @property {*} STATUS.TIMEOUT LPTStatus() only
 * 
 * @property {*} CONTROL.BIDI this bit must be set in order to read DATA
 * @property {*} CONTROL.SELECT_OUT pin 17, inverted (out)
 * @property {*} CONTROL.RESET pin 16 (out)
 * @property {*} CONTROL.LINEFEED pin 14, inverted (out)
 * @property {*} CONTROL.STROBE pin 1, inverted (out)
 */
PARALLEL = {
	DATA: {
		ADDR: 0,
		BIT0: (1 << 0),
		BIT1: (1 << 1),
		BIT2: (1 << 2),
		BIT3: (1 << 3),
		BIT4: (1 << 4),
		BIT5: (1 << 5),
		BIT6: (1 << 6),
		BIT7: (1 << 7)
	},
	STATUS: {
		ADDR: 1,
		BUSY: (1 << 7),
		ACK: (1 << 6),
		PAPER_OUT: (1 << 5),
		SELECT_IN: (1 << 4),
		ERROR: (1 << 3),
		TIMEOUT: (1 << 1)
	},
	CONTROL: {
		ADDR: 2,
		BIDI: (1 << 5),
		SELECT_OUT: (1 << 3),
		RESET: (1 << 2),
		LINEFEED: (1 << 1),
		STROBE: (1 << 0)
	}
};

var ULCORNER = AsciiCharDef(218);
var URCORNER = AsciiCharDef(191);
var HLINE = AsciiCharDef(196);
var VLINE = AsciiCharDef(179);
var LLCORNER = AsciiCharDef(192);
var LRCORNER = AsciiCharDef(217);

var K_Control_A = 0x001;
var K_Control_B = 0x002;
var K_Control_C = 0x003;
var K_Control_D = 0x004;
var K_Control_E = 0x005;
var K_Control_F = 0x006;
var K_Control_G = 0x007;
var K_BackSpace = 0x008;
var K_Control_H = 0x008;
var K_Tab = 0x009;
var K_Control_I = 0x009;
var K_LineFeed = 0x00a;
var K_Control_J = 0x00a;
var K_Control_K = 0x00b;
var K_Control_L = 0x00c;
var K_Return = 0x00d;
var K_Control_M = 0x00d;
var K_Control_N = 0x00e;
var K_Control_O = 0x00f;
var K_Control_P = 0x010;
var K_Control_Q = 0x011;
var K_Control_R = 0x012;
var K_Control_S = 0x013;
var K_Control_T = 0x014;
var K_Control_U = 0x015;
var K_Control_V = 0x016;
var K_Control_W = 0x017;
var K_Control_X = 0x018;
var K_Control_Y = 0x019;
var K_Control_Z = 0x01a;
var K_Control_LBracket = 0x01b;
var K_Escape = 0x01b;
var K_Control_BackSlash = 0x01c;
var K_Control_RBracket = 0x01d;
var K_Control_Caret = 0x01e;
var K_Control_Underscore = 0x01f;
var K_Space = 0x020;
var K_ExclamationPoint = 0x021;
var K_DoubleQuote = 0x022;
var K_Hash = 0x023;
var K_Dollar = 0x024;
var K_Percent = 0x025;
var K_Ampersand = 0x026;
var K_Quote = 0x027;
var K_LParen = 0x028;
var K_RParen = 0x029;
var K_Star = 0x02a;
var K_Plus = 0x02b;
var K_Comma = 0x02c;
var K_Dash = 0x02d;
var K_Period = 0x02e;
var K_Slash = 0x02f;
var K_Colon = 0x03a;
var K_SemiColon = 0x03b;
var K_LAngle = 0x03c;
var K_Equals = 0x03d;
var K_RAngle = 0x03e;
var K_QuestionMark = 0x03f;
var K_At = 0x040;
var K_LBracket = 0x05b;
var K_BackSlash = 0x05c;
var K_RBracket = 0x05d;
var K_Caret = 0x05e;
var K_UnderScore = 0x05f;
var K_BackQuote = 0x060;
var K_LBrace = 0x07b;
var K_Pipe = 0x07c;
var K_RBrace = 0x07d;
var K_Tilde = 0x07e;
var K_Control_Backspace = 0x07f;
var K_Alt_Escape = 0x101;
var K_Control_At = 0x103;
var K_Alt_Backspace = 0x10e;
var K_BackTab = 0x10f;
var K_Alt_Q = 0x110;
var K_Alt_W = 0x111;
var K_Alt_E = 0x112;
var K_Alt_R = 0x113;
var K_Alt_T = 0x114;
var K_Alt_Y = 0x115;
var K_Alt_U = 0x116;
var K_Alt_I = 0x117;
var K_Alt_O = 0x118;
var K_Alt_P = 0x119;
var K_Alt_LBracket = 0x11a;
var K_Alt_RBracket = 0x11b;
var K_Alt_Return = 0x11c;
var K_Alt_A = 0x11e;
var K_Alt_S = 0x11f;
var K_Alt_D = 0x120;
var K_Alt_F = 0x121;
var K_Alt_G = 0x122;
var K_Alt_H = 0x123;
var K_Alt_J = 0x124;
var K_Alt_K = 0x125;
var K_Alt_L = 0x126;
var K_Alt_Semicolon = 0x127;
var K_Alt_Quote = 0x128;
var K_Alt_Backquote = 0x129;
var K_Alt_Backslash = 0x12b;
var K_Alt_Z = 0x12c;
var K_Alt_X = 0x12d;
var K_Alt_C = 0x12e;
var K_Alt_V = 0x12f;
var K_Alt_B = 0x130;
var K_Alt_N = 0x131;
var K_Alt_M = 0x132;
var K_Alt_Comma = 0x133;
var K_Alt_Period = 0x134;
var K_Alt_Slash = 0x135;
var K_Alt_KPStar = 0x137;
var K_F1 = 0x13b;
var K_F2 = 0x13c;
var K_F3 = 0x13d;
var K_F4 = 0x13e;
var K_F5 = 0x13f;
var K_F6 = 0x140;
var K_F7 = 0x141;
var K_F8 = 0x142;
var K_F9 = 0x143;
var K_F10 = 0x144;
var K_Home = 0x147;
var K_Up = 0x148;
var K_PageUp = 0x149;
var K_Alt_KPMinus = 0x14a;
var K_Left = 0x14b;
var K_Center = 0x14c;
var K_Right = 0x14d;
var K_Alt_KPPlus = 0x14e;
var K_End = 0x14f;
var K_Down = 0x150;
var K_PageDown = 0x151;
var K_Insert = 0x152;
var K_Delete = 0x153;
var K_Shift_F1 = 0x154;
var K_Shift_F2 = 0x155;
var K_Shift_F3 = 0x156;
var K_Shift_F4 = 0x157;
var K_Shift_F5 = 0x158;
var K_Shift_F6 = 0x159;
var K_Shift_F7 = 0x15a;
var K_Shift_F8 = 0x15b;
var K_Shift_F9 = 0x15c;
var K_Shift_F10 = 0x15d;
var K_Control_F1 = 0x15e;
var K_Control_F2 = 0x15f;
var K_Control_F3 = 0x160;
var K_Control_F4 = 0x161;
var K_Control_F5 = 0x162;
var K_Control_F6 = 0x163;
var K_Control_F7 = 0x164;
var K_Control_F8 = 0x165;
var K_Control_F9 = 0x166;
var K_Control_F10 = 0x167;
var K_Alt_F1 = 0x168;
var K_Alt_F2 = 0x169;
var K_Alt_F3 = 0x16a;
var K_Alt_F4 = 0x16b;
var K_Alt_F5 = 0x16c;
var K_Alt_F6 = 0x16d;
var K_Alt_F7 = 0x16e;
var K_Alt_F8 = 0x16f;
var K_Alt_F9 = 0x170;
var K_Alt_F10 = 0x171;
var K_Control_Print = 0x172;
var K_Control_Left = 0x173;
var K_Control_Right = 0x174;
var K_Control_End = 0x175;
var K_Control_PageDown = 0x176;
var K_Control_Home = 0x177;
var K_Alt_1 = 0x178;
var K_Alt_2 = 0x179;
var K_Alt_3 = 0x17a;
var K_Alt_4 = 0x17b;
var K_Alt_5 = 0x17c;
var K_Alt_6 = 0x17d;
var K_Alt_7 = 0x17e;
var K_Alt_8 = 0x17f;
var K_Alt_9 = 0x180;
var K_Alt_0 = 0x181;
var K_Alt_Dash = 0x182;
var K_Alt_Equals = 0x183;
var K_Control_PageUp = 0x184;
var K_F11 = 0x185;
var K_F12 = 0x186;
var K_Shift_F11 = 0x187;
var K_Shift_F12 = 0x188;
var K_Control_F11 = 0x189;
var K_Control_F12 = 0x18a;
var K_Alt_F11 = 0x18b;
var K_Alt_F12 = 0x18c;
var K_Control_Up = 0x18d;
var K_Control_KPDash = 0x18e;
var K_Control_Center = 0x18f;
var K_Control_KPPlus = 0x190;
var K_Control_Down = 0x191;
var K_Control_Insert = 0x192;
var K_Control_Delete = 0x193;
var K_Control_KPSlash = 0x195;
var K_Control_KPStar = 0x196;
var K_Alt_EHome = 0x197;
var K_Alt_EUp = 0x198;
var K_Alt_EPageUp = 0x199;
var K_Alt_ELeft = 0x19b;
var K_Alt_ERight = 0x19d;
var K_Alt_EEnd = 0x19f;
var K_Alt_EDown = 0x1a0;
var K_Alt_EPageDown = 0x1a1;
var K_Alt_EInsert = 0x1a2;
var K_Alt_EDelete = 0x1a3;
var K_Alt_KPSlash = 0x1a4;
var K_Alt_Tab = 0x1a5;
var K_Alt_Enter = 0x1a6;
var K_EHome = 0x247;
var K_EUp = 0x248;
var K_EPageUp = 0x249;
var K_ELeft = 0x24b;
var K_ERight = 0x24d;
var K_EEnd = 0x24f;
var K_EDown = 0x250;
var K_EPageDown = 0x251;
var K_EInsert = 0x252;
var K_EDelete = 0x253;
var K_Control_ELeft = 0x273;
var K_Control_ERight = 0x274;
var K_Control_EEnd = 0x275;
var K_Control_EPageDown = 0x276;
var K_Control_EHome = 0x277;
var K_Control_EPageUp = 0x284;
var K_Control_EUp = 0x28d;
var K_Control_EDown = 0x291;
var K_Control_EInsert = 0x292;
var K_Control_EDelete = 0x293;

StartupInfo();
