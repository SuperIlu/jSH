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

exports._shapeMode = null;
exports._shape = [];

///////
// http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
function draw_line(x0, y0, x1, y1) {
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	var err = (dx > dy ? dx : -dy) / 2;

	while (true) {
		fast_point(x0, y0);
		if (x0 === x1 && y0 === y1) break;
		var e2 = err;
		if (e2 > -dx) { err -= dy; x0 += sx; }
		if (e2 < dy) { err += dx; y0 += sy; }
	}
}

///////
// https://github.com/kamoroso94/polygon-fill-benchmark
// GNU General Public License v3.0 https://github.com/kamoroso94/polygon-fill-benchmark/blob/master/LICENSE.txt

// converts list of points to list of non-horizontal edges
function pointsToEdges(points) {
	var edges = [];
	var p1 = points[points.length - 1];
	for (var i = 0; i < points.length; i++) {
		var p2 = points[i];
		// ignore horizontal edges
		if (p1[1] != p2[1]) {
			edges.push([p1, p2]);
		}
		p1 = p2;
	}
	return edges;
}

// linear interpolation
// finds x-value from scanline intersecting edge
function poly_lerp(yScan, p) {
	// Debugln("poly_lerp(" + JSON.stringify(yScan) + ", " + JSON.stringify(p) + ")");
	var p1 = p[0];
	var p2 = p[1];
	var x1 = p1[0];
	var y1 = p1[1];
	var x2 = p2[0];
	var y2 = p2[1];
	return Math.floor((yScan - y1) / (y2 - y1) * (x2 - x1) + x1);
}

// returns minimum y-value of two points
function getYMin(p) {
	var p1 = p[0];
	var p2 = p[1];
	var y1 = p1[1];
	var y2 = p2[1];
	return y1 <= y2 ? y1 : y2;
}

// returns maximum y-value of two points
function getYMax(p) {
	var p1 = p[0];
	var p2 = p[1];
	var y1 = p1[1];
	var y2 = p2[1];
	return y1 > y2 ? y1 : y2;
}

// returns the x-value of the point with the minimum y-value
function getXofYMin(p) {
	var p1 = p[0];
	var p2 = p[1];
	var x1 = p1[0];
	var y1 = p1[1];
	var x2 = p2[0];
	var y2 = p2[1];
	return y1 <= y2 ? x1 : x2;
}

// returns the x-value of the point with the maximum y-value
function getXofYMax(p) {
	var p1 = p[0];
	var p2 = p[1];
	var x1 = p1[0];
	var y1 = p1[1];
	var x2 = p2[0];
	var y2 = p2[1];
	return y1 > y2 ? x1 : x2;
}

function slpf(points) {
	if (points.length < 3) {
		return;
	}

	// initialize ET and AET
	var ET = pointsToEdges(points).sort(function (e1, e2) { return getYMin(e2) - getYMin(e1) });
	var AET = [];
	var yScan = getYMin(ET[ET.length - 1]);

	// Debugln("ET = " + JSON.stringify(ET))
	// Debugln("yScan = " + JSON.stringify(yScan))

	// repeat until both ET and AET are empty
	while (ET.length > 0 || AET.length > 0) {
		// manage AET
		moveEdges(yScan, ET, AET);
		removeEdges(yScan, AET);
		AET.sort(function (e1, e2) {
			var cmp = getXofYMin(e1) - getXofYMin(e2);
			return cmp == 0 ? getXofYMax(e1) - getXofYMax(e2) : cmp;
		});
		// fill spans on scanline
		var spans = getSpans(yScan, AET);
		drawSpans(spans, yScan);
		yScan++;
	}
}

// move active edges from ET to AET
function moveEdges(yScan, ET, AET) {
	// Debugln("moveEdges(" + JSON.stringify(yScan) + ", " + JSON.stringify(ET) + ", " + JSON.stringify(AET) + ")");
	while (ET.length > 0 && yScan == getYMin(ET[ET.length - 1])) {
		AET.push(ET.pop());
	}
}

// remove inactive edges from AET
function removeEdges(yScan, AET) {
	// Debugln("removeEdges(" + JSON.stringify(yScan) + ", " + JSON.stringify(AET) + ")");
	for (var i = 0; i < AET.length; i++) {
		if (yScan >= getYMax(AET[i])) {
			var last = AET.pop();
			if (i < AET.length) {
				AET[i] = last;
				i--;
			}
		}
	}
}

// find spans along scanline
function getSpans(yScan, AET) {
	var spans = [];
	for (var i = 0; i < AET.length; i++) {
		spans.push(poly_lerp(yScan, AET[i]));
	}
	// Debug("getSpans(" + JSON.stringify(yScan) + ", " + JSON.stringify(AET) + ")");
	// Debugln(" := " + JSON.stringify(spans));
	return spans;
}

function drawSpans(spans, yScan) {
	// Debugln("drawSpans(" + JSON.stringify(spans) + ", " + JSON.stringify(yScan) + ")");
	for (var i = 0; i < spans.length; i += 2) {
		fillSpan(spans[i], spans[i + 1], yScan);
	}
}

// fill pixels within a span
function fillSpan(x1, x2, y) {
	// Debugln("fillSpan(" + JSON.stringify(x1) + ", " + JSON.stringify(x2) + ", " + JSON.stringify(y) + ")");
	for (var x = x1; x < x2; x++) {
		fast_point(x, y);
	}
}


///////
// https://stackoverflow.com/questions/10322341/simple-algorithm-for-drawing-filled-ellipse-in-c-c
function filled_ellipse(ox, oy, w, h) {
	var hh = h * h;
	var ww = w * w;
	var hhww = hh * ww;
	var x0 = w;
	var dx = 0;

	// do the horizontal diameter
	for (var x = -w; x <= w; x++) {
		fast_point(ox + x, oy);
	}

	// now do both halves at the same time, away from the diameter
	for (var y = 1; y <= h; y++) {
		var x1 = x0 - (dx - 1);  // try slopes of dx - 1 or more
		for (; x1 > 0; x1--) {
			if (x1 * x1 * hh + y * y * ww <= hhww) {
				break;
			}
		}
		dx = x0 - x1;  // current approximation of the slope
		x0 = x1;

		for (var x = -x0; x <= x0; x++) {
			fast_point(ox + x, oy - y);
			fast_point(ox + x, oy + y);
		}
	}
}

///////
// https://stackoverflow.com/questions/15474122/is-there-a-midpoint-ellipse-algorithm/15482128#15482128
function ellipsePlotPoints(xc, yc, x, y) {
	fast_point(xc + x, yc + y);
	fast_point(xc - x, yc + y);
	fast_point(xc + x, yc - y);
	fast_point(xc - x, yc - y);
}

function draw_ellipse(xc, yc, a, b) {
	var a2 = a * a;
	var b2 = b * b;
	var twoa2 = 2 * a2;
	var twob2 = 2 * b2;
	var p;
	var x = 0;
	var y = b;
	var px = 0;
	var py = twoa2 * y;

	/* Plot the initial point in each quadrant. */
	ellipsePlotPoints(xc, yc, x, y);

	/* Region 1 */
	p = Math.round(b2 - (a2 * b) + (0.25 * a2));
	while (px < py) {
		x++;
		px += twob2;
		if (p < 0)
			p += b2 + px;
		else {
			y--;
			py -= twoa2;
			p += b2 + px - py;
		}
		ellipsePlotPoints(xc, yc, x, y);
	}

	/* Region 2 */
	p = Math.round(b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2);
	while (y > 0) {
		y--;
		py -= twoa2;
		if (p > 0)
			p += a2 - py;
		else {
			x++;
			px += twob2;
			p += a2 - py + px;
		}
		ellipsePlotPoints(xc, yc, x, y);
	}
}
exports.line = function (x1, y1, x2, y2) {
	if (_currentEnv._stroke != NO_COLOR) {
		var tx1 = _transX(x1, y1);
		var ty1 = _transY(x1, y1);
		var tx2 = _transX(x2, y2);
		var ty2 = _transY(x2, y2);

		global.__screen__.TextColor(_currentEnv._stroke);
		global.__screen__.TextBackground(_currentEnv._stroke);
		draw_line(tx1, ty1, tx2, ty2);
	}
};

fast_line = function (x1, y1, x2, y2) {
	if (_currentEnv._stroke != NO_COLOR) {
		global.__screen__.TextColor(_currentEnv._stroke);
		global.__screen__.TextBackground(_currentEnv._stroke);
		draw_line(x1, y1, x2, y2);
	}
};


exports.point = function (x, y) {
	if (_currentEnv._stroke != NO_COLOR) {
		global.__screen__.TextColor(_currentEnv._stroke);
		global.__screen__.TextBackground(_currentEnv._stroke);
		global.__screen__.Put0(_transX(x, y), _transY(x, y), " ");
	}
};

fast_point = function (x, y) {
	global.__screen__.Put0(x, y, " ");
}

exports.ellipse = function (x, y, w, h) {
	h = h || w;

	var x1 = x;
	var y1 = y;

	if (_currentEnv._ellipseMode === CENTER) {
		var w1 = w / 2;
		var h1 = h / 2;
	} else if (_currentEnv._ellipseMode === RADIUS) {
		var w1 = w;
		var h1 = h;
	} else if (_currentEnv._ellipseMode === CORNER) {
		x1 = x - w;
		y1 = y - h;
		var w1 = w / 2;
		var h1 = h / 2;
	} else if (_currentEnv._ellipseMode === CORNERS) {
		var w1 = (w - x) / 2;
		var h1 = (h - y) / 2;
	} else {
		Debug("Unknown ellipseMode=" + _currentEnv._ellipseMode);
		return;
	}

	var tx = _transX(x1, y1);
	var ty = _transY(x1, y1);

	if (_currentEnv._fill != NO_COLOR) {
		global.__screen__.TextColor(_currentEnv._fill);
		global.__screen__.TextBackground(_currentEnv._fill);
		filled_ellipse(tx, ty, w1, h1);
	}
	if (_currentEnv._stroke != NO_COLOR) {
		global.__screen__.TextColor(_currentEnv._stroke);
		global.__screen__.TextBackground(_currentEnv._stroke);
		draw_ellipse(tx, ty, w1, h1);
	}
};

exports.circle = function (x, y, r) {
	ellipse(x, y, r);
};

exports.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
	beginShape();
	vertex(x1, y1);
	vertex(x2, y2);
	vertex(x3, y3);
	vertex(x4, y4);
	vertex(x1, y1);
	endShape(CLOSE);
};

exports.rect = function (x, y, w, h) {
	beginShape();
	if (_currentEnv._rectMode === CORNER) {
		vertex(x, y);
		vertex(x + w, y);
		vertex(x + w, y + h);
		vertex(x, y + h);
	} else if (_currentEnv._rectMode === CORNERS) {
		vertex(x, y);
		vertex(w, y);
		vertex(w, h);
		vertex(x, h);
	} else if (_currentEnv._rectMode === CENTER) {
		var wh = w / 2;
		var hh = h / 2;
		vertex(x - wh, y - hh);
		vertex(x + wh, y - hh);
		vertex(x + wh, y + hh);
		vertex(x - wh, y + hh);
	} else if (_currentEnv._rectMode === RADIUS) {
		vertex(x - w, y - h);
		vertex(x + w, y - h);
		vertex(x + w, y + h);
		vertex(x - w, y + h);
	} else {
		Debug("Unknown rectMode=" + _currentEnv._rectMode);
		return;
	}
	endShape(CLOSE);
};

exports.square = function (x, y, s) {
	rect(x, y, s, s);
};

exports.triangle = function (x1, y1, x2, y2, x3, y3) {
	beginShape(TRIANGLES);
	vertex(x1, y1);
	vertex(x2, y2);
	vertex(x3, y3);
	endShape();
};

exports.beginShape = function (m) {
	_shapeMode = m;
	_shape = [];
};
exports.vertex = function (x, y) {
	_shape.push([_transX(x, y), _transY(x, y)]);
};
exports.endShape = function (p) {
	if (_shapeMode === POINTS) {
		_shape.forEach(function (p) {
			point(p[0], p[1]);
		});
	} else if (_shapeMode === LINES) {
		for (var i = 0; i < _shape.length; i += 2) {
			fast_line(_shape[i][0], _shape[i][1], _shape[i + 1][0], _shape[i + 1][1]);
		}
	} else if (_shapeMode === TRIANGLES) {
		for (var i = 0; i < _shape.length; i += 3) {
			var tri = [_shape[i], _shape[i + 1], _shape[i + 2]];
			if (_currentEnv._fill != NO_COLOR) {
				global.__screen__.TextColor(_currentEnv._fill);
				global.__screen__.TextBackground(_currentEnv._fill);
				slpf(tri);
			}
			if (_currentEnv._stroke != NO_COLOR) {
				_PolyLine(tri, true);
			}
		}
	} else {
		if (_currentEnv._fill != NO_COLOR) {
			global.__screen__.TextColor(_currentEnv._fill);
			global.__screen__.TextBackground(_currentEnv._fill);
			slpf(_shape);
		}
		if (_currentEnv._stroke != NO_COLOR) {
			_PolyLine(_shape, p === CLOSE);
		}
	}
};
exports._PolyLine = function (shape, close) {
	for (var i = 0; i < shape.length - 1; i++) {
		fast_line(shape[i][0], shape[i][1], shape[i + 1][0], shape[i + 1][1]);
	}
	if (close) {
		var last = shape.length - 1;
		fast_line(shape[0][0], shape[0][1], shape[last][0], shape[last][1], _currentEnv._stroke);
	}
}


exports.arc = function (x, y, w, h, start, end, style) {
};

exports.rectMode = function (m) {
	if (
		m === CORNER ||
		m === CORNERS ||
		m === RADIUS ||
		m === CENTER
	) {
		_currentEnv._rectMode = m;
	}
	return this;
};
exports.ellipseMode = function (m) {
	if (
		m === CORNER ||
		m === CORNERS ||
		m === RADIUS ||
		m === CENTER
	) {
		_currentEnv._ellipseMode = m;
	}
	return this;
};

exports.strokeWeight = function (w) {
};
