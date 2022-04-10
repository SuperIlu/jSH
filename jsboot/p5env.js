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

exports._wanted_frameRate = 30;
exports._current_frameRate;

exports.print = function (s) {
	Debug(s);
};

exports.println = function (s) {
	Debugln(s);
};

exports.frameCount = 0;
exports.focused = true;
exports.frameRate = function (r) {
	_wanted_frameRate = r;
};
exports.getFrameRate = function () {
	return _current_frameRate;
};
exports.displayWidth = 0;
exports.displayHeight = 0;
exports.windowWidth = 0;
exports.windowHeight = 0;
exports.width = 0;
exports.height = 0;
exports.fullScreen = function () {
	return true;
};
exports.pixelDensity = function () {
	return 1;
};
exports.getURL = function () {
	return "";
};
exports.getURLPath = function () {
	return "";
};
exports.getURLParams = function () {
	return "";
};
