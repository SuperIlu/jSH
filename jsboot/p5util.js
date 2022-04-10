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

exports.append = function (array, value) {
	array.push(value);
	return array;
};
exports.arrayCopy = function (src, srcPosition, dst, dstPosition, length) {
	// the index to begin splicing from dst array
	var start;
	var end;

	if (typeof length !== 'undefined') {
		end = Math.min(length, src.length);
		start = dstPosition;
		src = src.slice(srcPosition, end + srcPosition);
	} else {
		if (typeof dst !== 'undefined') {
			// src, dst, length
			// rename  so we don't get confused
			end = dst;
			end = Math.min(end, src.length);
		} else {
			// src, dst
			end = src.length;
		}

		start = 0;
		// rename  so we don't get confused
		dst = srcPosition;
		src = src.slice(0, end);
	}

	// Since we are not returning the array and JavaScript is pass by reference
	// we must modify the actual values of the array
	// instead of reassigning arrays
	Array.prototype.splice.apply(dst, [start, end].concat(src));
};
exports.concat = function (list0, list1) {
	return list0.concat(list1);
};
exports.reverse = function (list) {
	return list.reverse();
};
exports.shorten = function (list) {
	list.pop();
	return list;
};
exports.shuffle = function (arr, bool) {
	var isView = ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(arr);
	arr = bool || isView ? arr : arr.slice();

	var rnd,
		tmp,
		idx = arr.length;
	while (idx > 1) {
		rnd = (Math.random() * idx) | 0;

		tmp = arr[--idx];
		arr[idx] = arr[rnd];
		arr[rnd] = tmp;
	}

	return arr;
};
exports.sort = function (list, count) {
	var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
	var rest = count ? list.slice(Math.min(count, list.length)) : [];
	if (typeof arr[0] === 'string') {
		arr = arr.sort();
	} else {
		arr = arr.sort(function (a, b) {
			return a - b;
		});
	}
	return arr.concat(rest);
};
exports.splice = function (list, value, index) {
	// note that splice returns spliced elements and not an array
	Array.prototype.splice.apply(list, [index, 0].concat(value));

	return list;
};
exports.subset = function (list, start, count) {
	if (typeof count !== 'undefined') {
		return list.slice(start, start + count);
	} else {
		return list.slice(start, list.length);
	}
};
exports.float = function (str) {
	if (str instanceof Array) {
		return str.map(parseFloat);
	}
	return parseFloat(str);
};
exports.int = function (n, radix) {
	radix = radix || 10;
	if (typeof n === 'string') {
		return parseInt(n, radix);
	} else if (typeof n === 'number') {
		return n | 0;
	} else if (typeof n === 'boolean') {
		return n ? 1 : 0;
	} else if (n instanceof Array) {
		return n.map(function (n) {
			return exports.int(n, radix);
		});
	}
};
exports.str = function (n) {
	if (n instanceof Array) {
		return n.map(exports.str);
	} else {
		return String(n);
	}
};
exports.boolean = function (n) {
	if (typeof n === 'number') {
		return n !== 0;
	} else if (typeof n === 'string') {
		return n.toLowerCase() === 'true';
	} else if (typeof n === 'boolean') {
		return n;
	} else if (n instanceof Array) {
		return n.map(exports.boolean);
	}
};
exports.byte = function (n) {
	var nn = exports.int(n, 10);
	if (typeof nn === 'number') {
		return (nn + 128) % 256 - 128;
	} else if (nn instanceof Array) {
		return nn.map(exports.byte);
	}
};
exports.char = function (n) {
	if (typeof n === 'number' && !isNaN(n)) {
		return String.fromCharCode(n);
	} else if (n instanceof Array) {
		return n.map(exports.char);
	} else if (typeof n === 'string') {
		return exports.char(parseInt(n, 10));
	}
};
exports.unchar = function (n) {
	if (typeof n === 'string' && n.length === 1) {
		return n.charCodeAt(0);
	} else if (n instanceof Array) {
		return n.map(exports.unchar);
	}
};
exports.hex = function (n, digits) {
	digits = digits === undefined || digits === null ? (digits = 8) : digits;
	if (n instanceof Array) {
		return n.map(function (n) {
			return exports.hex(n, digits);
		});
	} else if (typeof n === 'number') {
		if (n < 0) {
			n = 0xffffffff + n + 1;
		}
		var hex = Number(n)
			.toString(16)
			.toUpperCase();
		while (hex.length < digits) {
			hex = '0' + hex;
		}
		if (hex.length >= digits) {
			hex = hex.substring(hex.length - digits, hex.length);
		}
		return hex;
	}
};
exports.unhex = function (n) {
	if (n instanceof Array) {
		return n.map(exports.unhex);
	} else {
		return parseInt('0x' + n, 16);
	}
};
exports.join = function (list, separator) {
	p5._validateParameters('join', arguments);
	return list.join(separator);
};
exports.match = function (str, reg) {
	p5._validateParameters('match', arguments);
	return str.match(reg);
};
exports.matchAll = function (str, reg) {
	p5._validateParameters('matchAll', arguments);
	var re = new RegExp(reg, 'g');
	var match = re.exec(str);
	var matches = [];
	while (match !== null) {
		matches.push(match);
		// matched text: match[0]
		// match start: match.index
		// capturing group n: match[n]
		match = re.exec(str);
	}
	return matches;
};
exports.nf = function (nums, left, right) {
	p5._validateParameters('nf', arguments);
	if (nums instanceof Array) {
		return nums.map(function (x) {
			return doNf(x, left, right);
		});
	} else {
		var typeOfFirst = Object.prototype.toString.call(nums);
		if (typeOfFirst === '[object Arguments]') {
			if (nums.length === 3) {
				return this.nf(nums[0], nums[1], nums[2]);
			} else if (nums.length === 2) {
				return this.nf(nums[0], nums[1]);
			} else {
				return this.nf(nums[0]);
			}
		} else {
			return doNf(nums, left, right);
		}
	}
};
function doNf(num, left, right) {
	var neg = num < 0;
	var n = neg ? num.toString().substring(1) : num.toString();
	var decimalInd = n.indexOf('.');
	var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
	var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
	var str = neg ? '-' : '';
	if (typeof right !== 'undefined') {
		var decimal = '';
		if (decimalInd !== -1 || right - decPart.length > 0) {
			decimal = '.';
		}
		if (decPart.length > right) {
			decPart = decPart.substring(0, right);
		}
		for (var i = 0; i < left - intPart.length; i++) {
			str += '0';
		}
		str += intPart;
		str += decimal;
		str += decPart;
		for (var j = 0; j < right - decPart.length; j++) {
			str += '0';
		}
		return str;
	} else {
		for (var k = 0; k < Math.max(left - intPart.length, 0); k++) {
			str += '0';
		}
		str += n;
		return str;
	}
}
exports.nfc = function (num, right) {
	p5._validateParameters('nfc', arguments);
	if (num instanceof Array) {
		return num.map(function (x) {
			return doNfc(x, right);
		});
	} else {
		return doNfc(num, right);
	}
};
function doNfc(num, right) {
	num = num.toString();
	var dec = num.indexOf('.');
	var rem = dec !== -1 ? num.substring(dec) : '';
	var n = dec !== -1 ? num.substring(0, dec) : num;
	n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (right === 0) {
		rem = '';
	} else if (typeof right !== 'undefined') {
		if (right > rem.length) {
			rem += dec === -1 ? '.' : '';
			var len = right - rem.length + 1;
			for (var i = 0; i < len; i++) {
				rem += '0';
			}
		} else {
			rem = rem.substring(0, right + 1);
		}
	}
	return n + rem;
}
exports.nfp = function () {
	p5._validateParameters('nfp', arguments);
	var nfRes = exports.nf.apply(this, arguments);
	if (nfRes instanceof Array) {
		return nfRes.map(addNfp);
	} else {
		return addNfp(nfRes);
	}
};
function addNfp(num) {
	return parseFloat(num) > 0 ? '+' + num.toString() : num.toString();
}
exports.nfs = function () {
	p5._validateParameters('nfs', arguments);
	var nfRes = exports.nf.apply(this, arguments);
	if (nfRes instanceof Array) {
		return nfRes.map(addNfs);
	} else {
		return addNfs(nfRes);
	}
};
function addNfs(num) {
	return parseFloat(num) > 0 ? ' ' + num.toString() : num.toString();
}
exports.split = function (str, delim) {
	p5._validateParameters('split', arguments);
	return str.split(delim);
};
exports.splitTokens = function (value, delims) {
	p5._validateParameters('splitTokens', arguments);
	var d;
	if (typeof delims !== 'undefined') {
		var str = delims;
		var sqc = /\]/g.exec(str);
		var sqo = /\[/g.exec(str);
		if (sqo && sqc) {
			str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
			sqo = /\[/g.exec(str);
			str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
			d = new RegExp('[\\[' + str + '\\]]', 'g');
		} else if (sqc) {
			str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
			d = new RegExp('[' + str + '\\]]', 'g');
		} else if (sqo) {
			str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
			d = new RegExp('[' + str + '\\[]', 'g');
		} else {
			d = new RegExp('[' + str + ']', 'g');
		}
	} else {
		d = /\s/g;
	}
	return value.split(d).filter(function (n) {
		return n;
	});
};
exports.trim = function (str) {
	p5._validateParameters('trim', arguments);
	if (str instanceof Array) {
		return str.map(this.trim);
	} else {
		return str.trim();
	}
};
exports.day = function () {
	return new Date().getDate();
};
exports.hour = function () {
	return new Date().getHours();
};
exports.minute = function () {
	return new Date().getMinutes();
};
exports.millis = function () {
	return MsecTime();
};
exports.month = function () {
	return new Date().getMonth() + 1; //January is 0!
};
exports.second = function () {
	return new Date().getSeconds();
};
exports.year = function () {
	return new Date().getFullYear();
};
exports.createStringDict = function (key, value) {
	return new StringDict(key, value);
};
exports.createNumberDict = function (key, value) {
	return new NumberDict(key, value);
};
exports.TypedDict = function (key, value) {
	if (key instanceof Object) {
		this.data = key;
	} else {
		this.data = {};
		this.data[key] = value;
	}
	return this;
};
exports.TypedDict.prototype.size = function () {
	return Object.keys(this.data).length;
};
exports.TypedDict.prototype.hasKey = function (key) {
	return this.data.hasOwnProperty(key);
};
exports.TypedDict.prototype.get = function (key) {
	if (this.data.hasOwnProperty(key)) {
		return this.data[key];
	} else {
		Println(key + ' does not exist in this Dictionary');
	}
};
exports.TypedDict.prototype.set = function (key, value) {
	if (this._validate(value)) {
		this.data[key] = value;
	} else {
		Println('Those values dont work for this dictionary type.');
	}
};
exports.TypedDict.prototype._addObj = function (obj) {
	for (var key in obj) {
		this.set(key, obj[key]);
	}
};
exports.TypedDict.prototype.create = function (key, value) {
	if (key instanceof Object && typeof value === 'undefined') {
		this._addObj(key);
	} else if (typeof key !== 'undefined') {
		this.set(key, value);
	} else {
		Println(
			'In order to create a new Dictionary entry you must pass ' +
			'an object or a key, value pair'
		);
	}
};
exports.TypedDict.prototype.clear = function () {
	this.data = {};
};
exports.TypedDict.prototype.remove = function (key) {
	if (this.data.hasOwnProperty(key)) {
		delete this.data[key];
	} else {
		throw new Error(key + ' does not exist in this Dictionary');
	}
};
exports.TypedDict.prototype.print = function () {
	for (var item in this.data) {
		Println('key:' + item + ' value:' + this.data[item]);
	}
};
exports.TypedDict.prototype.saveJSON = function (filename, opt) {
	prototype.saveJSON(this.data, filename, opt);
};
exports.TypedDict.prototype._validate = function (value) {
	return true;
};
exports.StringDict = function () {
	TypedDict.apply(this, arguments);
};
exports.StringDict.prototype = Object.create(exports.TypedDict.prototype);
exports.StringDict.prototype._validate = function (value) {
	return typeof value === 'string';
};
exports.NumberDict = function () {
	TypedDict.apply(this, arguments);
};
exports.NumberDict.prototype = Object.create(exports.TypedDict.prototype);
exports.NumberDict.prototype._validate = function (value) {
	return typeof value === 'number';
};
exports.NumberDict.prototype.add = function (key, amount) {
	if (this.data.hasOwnProperty(key)) {
		this.data[key] += amount;
	} else {
		Println('The key - ' + key + ' does not exist in this dictionary.');
	}
};
exports.NumberDict.prototype.sub = function (key, amount) {
	this.add(key, -amount);
};
exports.NumberDict.prototype.mult = function (key, amount) {
	if (this.data.hasOwnProperty(key)) {
		this.data[key] *= amount;
	} else {
		Println('The key - ' + key + ' does not exist in this dictionary.');
	}
};
exports.NumberDict.prototype.div = function (key, amount) {
	if (this.data.hasOwnProperty(key)) {
		this.data[key] /= amount;
	} else {
		Println('The key - ' + key + ' does not exist in this dictionary.');
	}
};
exports.NumberDict.prototype._valueTest = function (flip) {
	if (Object.keys(this.data).length === 0) {
		throw new Error(
			'Unable to search for a minimum or maximum value on an empty NumberDict'
		);
	} else if (Object.keys(this.data).length === 1) {
		return this.data[Object.keys(this.data)[0]];
	} else {
		var result = this.data[Object.keys(this.data)[0]];
		for (var key in this.data) {
			if (this.data[key] * flip < result * flip) {
				result = this.data[key];
			}
		}
		return result;
	}
};
exports.NumberDict.prototype.minValue = function () {
	return this._valueTest(1);
};
exports.NumberDict.prototype.maxValue = function () {
	return this._valueTest(-1);
};
exports.NumberDict.prototype._keyTest = function (flip) {
	if (Object.keys(this.data).length === 0) {
		throw new Error('Unable to use minValue on an empty NumberDict');
	} else if (Object.keys(this.data).length === 1) {
		return Object.keys(this.data)[0];
	} else {
		var result = Object.keys(this.data)[0];
		for (var i = 1; i < Object.keys(this.data).length; i++) {
			if (Object.keys(this.data)[i] * flip < result * flip) {
				result = Object.keys(this.data)[i];
			}
		}
		return result;
	}
};
exports.NumberDict.prototype.minKey = function () {
	return this._keyTest(1);
};
exports.NumberDict.prototype.maxKey = function () {
	return this._keyTest(-1);
};
