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

exports.PVector = function PVector() {
	var x, y, z;
	x = arguments[0] || 0;
	y = arguments[1] || 0;
	z = arguments[2] || 0;
	/**
	 * The x component of the vector
	 * @property x {Number}
	 */
	this.x = x;
	/**
	 * The y component of the vector
	 * @property y {Number}
	 */
	this.y = y;
	/**
	 * The z component of the vector
	 * @property z {Number}
	 */
	this.z = z;
};
exports.PVector.prototype.toString = function p5VectorToString() {
	return 'PVector Object : [' + this.x + ', ' + this.y + ', ' + this.z + ']';
};
exports.PVector.prototype.set = function set(x, y, z) {
	if (x instanceof PVector) {
		this.x = x.x || 0;
		this.y = x.y || 0;
		this.z = x.z || 0;
		return this;
	}
	if (x instanceof Array) {
		this.x = x[0] || 0;
		this.y = x[1] || 0;
		this.z = x[2] || 0;
		return this;
	}
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	return this;
};
exports.PVector.prototype.copy = function copy() {
	return new PVector(this.x, this.y, this.z);
};
exports.PVector.prototype.add = function add(x, y, z) {
	if (x instanceof PVector) {
		this.x += x.x || 0;
		this.y += x.y || 0;
		this.z += x.z || 0;
		return this;
	}
	if (x instanceof Array) {
		this.x += x[0] || 0;
		this.y += x[1] || 0;
		this.z += x[2] || 0;
		return this;
	}
	this.x += x || 0;
	this.y += y || 0;
	this.z += z || 0;
	return this;
};
exports.PVector.prototype.sub = function sub(x, y, z) {
	if (x instanceof PVector) {
		this.x -= x.x || 0;
		this.y -= x.y || 0;
		this.z -= x.z || 0;
		return this;
	}
	if (x instanceof Array) {
		this.x -= x[0] || 0;
		this.y -= x[1] || 0;
		this.z -= x[2] || 0;
		return this;
	}
	this.x -= x || 0;
	this.y -= y || 0;
	this.z -= z || 0;
	return this;
};
exports.PVector.prototype.mult = function mult(n) {
	if (!(typeof n === 'number' && isFinite(n))) {
		Println(
			'PVector.prototype.mult:',
			'n is undefined or not a finite number'
		);
		return this;
	}
	this.x *= n;
	this.y *= n;
	this.z *= n;
	return this;
};
exports.PVector.prototype.div = function div(n) {
	if (!(typeof n === 'number' && isFinite(n))) {
		Println(
			'PVector.prototype.div:',
			'n is undefined or not a finite number'
		);
		return this;
	}
	if (n === 0) {
		Println('PVector.prototype.div:', 'divide by 0');
		return this;
	}
	this.x /= n;
	this.y /= n;
	this.z /= n;
	return this;
};
exports.PVector.prototype.mag = function mag() {
	return Math.sqrt(this.magSq());
};
exports.PVector.prototype.magSq = function magSq() {
	var x = this.x;
	var y = this.y;
	var z = this.z;
	return x * x + y * y + z * z;
};
exports.PVector.prototype.dot = function dot(x, y, z) {
	if (x instanceof PVector) {
		return this.dot(x.x, x.y, x.z);
	}
	return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
};
exports.PVector.prototype.cross = function cross(v) {
	var x = this.y * v.z - this.z * v.y;
	var y = this.z * v.x - this.x * v.z;
	var z = this.x * v.y - this.y * v.x;

	return new PVector(x, y, z);
};
exports.PVector.prototype.dist = function dist(v) {
	return v
		.copy()
		.sub(this)
		.mag();
};
exports.PVector.prototype.normalize = function normalize() {
	var len = this.mag();
	// here we multiply by the reciprocal instead of calling 'div()'
	// since div duplicates this zero check.
	if (len !== 0) this.mult(1 / len);
	return this;
};
exports.PVector.prototype.limit = function limit(max) {
	var mSq = this.magSq();
	if (mSq > max * max) {
		this.div(Math.sqrt(mSq)) //normalize it
			.mult(max);
	}
	return this;
};
exports.PVector.prototype.setMag = function setMag(n) {
	return this.normalize().mult(n);
};
exports.PVector.prototype.heading = function heading() {
	var h = Math.atan2(this.y, this.x);
	return _fromRadians(h);
};
exports.PVector.prototype.rotate = function rotate(a) {
	var newHeading = this.heading() + a;
	newHeading = _toRadians(newHeading);
	var mag = this.mag();
	this.x = Math.cos(newHeading) * mag;
	this.y = Math.sin(newHeading) * mag;
	return this;
};
exports.PVector.prototype.angleBetween = function angleBetween(v) {
	var dotmagmag = this.dot(v) / (this.mag() * v.mag());
	// Mathematically speaking: the dotmagmag variable will be between -1 and 1
	// inclusive. Practically though it could be slightly outside this range due
	// to floating-point rounding issues. This can make Math.acos return NaN.
	//
	// Solution: we'll clamp the value to the -1,1 range
	var angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
	return _fromRadians(angle);
};
exports.PVector.prototype.lerp = function lerp(x, y, z, amt) {
	if (x instanceof PVector) {
		return this.lerp(x.x, x.y, x.z, y);
	}
	this.x += (x - this.x) * amt || 0;
	this.y += (y - this.y) * amt || 0;
	this.z += (z - this.z) * amt || 0;
	return this;
};
exports.PVector.prototype.array = function array() {
	return [this.x || 0, this.y || 0, this.z || 0];
};
exports.PVector.prototype.equals = function equals(x, y, z) {
	var a, b, c;
	if (x instanceof PVector) {
		a = x.x || 0;
		b = x.y || 0;
		c = x.z || 0;
	} else if (x instanceof Array) {
		a = x[0] || 0;
		b = x[1] || 0;
		c = x[2] || 0;
	} else {
		a = x || 0;
		b = y || 0;
		c = z || 0;
	}
	return this.x === a && this.y === b && this.z === c;
};
exports.PVector.fromAngle = function fromAngle(angle, length) {
	if (typeof length === 'undefined') {
		length = 1;
	}
	return new exports.PVector(length * Math.cos(angle), length * Math.sin(angle), 0);
};
exports.PVector.fromAngles = function (theta, phi, length) {
	if (typeof length === 'undefined') {
		length = 1;
	}
	var cosPhi = Math.cos(phi);
	var sinPhi = Math.sin(phi);
	var cosTheta = Math.cos(theta);
	var sinTheta = Math.sin(theta);

	return new exports.PVector(
		length * sinTheta * sinPhi,
		-length * cosTheta,
		length * sinTheta * cosPhi
	);
};
exports.PVector.random2D = function random2D() {
	return this.fromAngle(Math.random() * TWO_PI);
};
exports.PVector.random3D = function random3D() {
	var angle = Math.random() * constants.TWO_PI;
	var vz = Math.random() * 2 - 1;
	var vzBase = Math.sqrt(1 - vz * vz);
	var vx = vzBase * Math.cos(angle);
	var vy = vzBase * Math.sin(angle);
	return new exports.PVector(vx, vy, vz);
};
exports.PVector.add = function add(v1, v2, target) {
	if (!target) {
		target = v1.copy();
	} else {
		target.set(v1);
	}
	target.add(v2);
	return target;
};
exports.PVector.sub = function sub(v1, v2, target) {
	if (!target) {
		target = v1.copy();
	} else {
		target.set(v1);
	}
	target.sub(v2);
	return target;
};
exports.PVector.mult = function mult(v, n, target) {
	if (!target) {
		target = v.copy();
	} else {
		target.set(v);
	}
	target.mult(n);
	return target;
};
exports.PVector.div = function div(v, n, target) {
	if (!target) {
		target = v.copy();
	} else {
		target.set(v);
	}
	target.div(n);
	return target;
};
exports.PVector.dot = function dot(v1, v2) {
	return v1.dot(v2);
};
exports.PVector.cross = function cross(v1, v2) {
	return v1.cross(v2);
};
exports.PVector.dist = function dist(v1, v2) {
	return v1.dist(v2);
};
exports.PVector.lerp = function lerp(v1, v2, amt, target) {
	if (!target) {
		target = v1.copy();
	} else {
		target.set(v1);
	}
	target.lerp(v2, amt);
	return target;
};
exports.PVector.mag = function mag(vecT) {
	var x = vecT.x,
		y = vecT.y,
		z = vecT.z;
	var magSq = x * x + y * y + z * z;
	return Math.sqrt(magSq);
};
exports.p5 = {};
exports.p5.Vector = exports.PVector;
