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

exports._ensureMatrix = function () {
	if (!_currentEnv._matrix) {
		_currentEnv._matrix = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	}
}
exports._MaMul = function (a, b) {
	var aNumRows = a.length, aNumCols = a[0].length,
		bNumRows = b.length, bNumCols = b[0].length,
		m = new Array(aNumRows);  // initialize array of rows
	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols); // initialize the current row
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;             // initialize the current cell
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += a[r][i] * b[i][c];
			}
		}
	}
	return m;
};
exports._transX = function (x, y) {
	if (_currentEnv._matrix) {
		return Math.round(x * _currentEnv._matrix[0][0] + y * _currentEnv._matrix[0][1] + _currentEnv._matrix[0][2]);
	} else {
		return Math.round(x);
	}
}
exports._transY = function (x, y) {
	if (_currentEnv._matrix) {
		return Math.round(x * _currentEnv._matrix[1][0] + y * _currentEnv._matrix[1][1] + _currentEnv._matrix[1][2]);
	} else {
		return Math.round(y);
	}
}
exports.applyMatrix = function (a, b, c, d, e, f) {
	_ensureMatrix();

	var pm = function (m) {
		for (var r = 0; r < m.length; ++r) {
			Println('  ' + m[r].join(' '));
		}
	}

	var m1 = [
		[a, c, e],
		[b, d, f],
		[0, 0, 1]
	];

	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
exports.resetMatrix = function () {
	_currentEnv._matrix = null;
};
exports.rotate = function (angle) {
	_ensureMatrix();
	var cA = cos(angle);
	var sA = sin(angle);

	var m1 = [
		[cA, -sA, 0],
		[sA, cA, 0],
		[0, 0, 1]
	];
	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
exports.shearX = function (angle) {
	_ensureMatrix();
	var m1 = [
		[1, tan(angle), 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
exports.shearY = function (angle) {
	_ensureMatrix();
	var m1 = [
		[1, 0, 0],
		[tan(angle), 1, 0],
		[0, 0, 1]
	];
	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
exports.translate = function (x, y, z) {
	_ensureMatrix();
	if (x instanceof PVector) {
		y = x.y;
		x = x.x;
	}
	var m1 = [
		[1, 0, x],
		[0, 1, y],
		[0, 0, 1]
	];
	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
exports.scale = function (x, y, z) {
	_ensureMatrix();
	// Only check for Vector argument type if Vector is available
	if (x instanceof PVector) {
		var v = x;
		x = v.x;
		y = v.y;
		z = v.z;
	} else if (x instanceof Array) {
		var rg = x;
		x = rg[0];
		y = rg[1];
		z = rg[2] || 1;
	}
	if (isNaN(y)) {
		y = z = x;
	} else if (isNaN(z)) {
		z = 1;
	}
	var m1 = [
		[x, 0, 0],
		[0, y, 0],
		[0, 0, 1]
	];
	_currentEnv._matrix = _MaMul(_currentEnv._matrix, m1);
};
