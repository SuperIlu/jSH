/**
 * p5js "emulation". See the official p5js documentation for reference.
 * This only lists the available function.
 * Not all function actually DO things (e.g. strokeWeight()).
 * I only did minimal testing, so there might be bugs...
 * 
 * **Note: p5js must be activated by Include("p5") before using it.**
 * 
 * @see https://p5js.org/reference/
 * 
 * @module p5js
 */

/** */
frameCount = 0;
/** */
focused = true;
/** */
displayWidth = 0;
/** */
displayHeight = 0;
/** */
windowWidth = 0;
/** */
windowHeight = 0;
/** */
width = 0;
/** */
height = 0;
/** */
HALF_PI = PI / 2;
/** */
PI = PI;
/** */
QUARTER_PI = PI / 4;
/** */
TAU = PI * 2;
/** */
TWO_PI = PI * 2;
/** */
DEG_TO_RAD = PI / 180.0;
/** */
RAD_TO_DEG = 180.0 / PI;
/** */
DEGREES = 'degrees';
/** */
RADIANS = 'radians';
/** */
LEFT = 'left';
/** */
CENTER = 'center';
/** */
RIGHT = 'right';
/** */
TOP = 'top';
/** */
BOTTOM = 'bottom';
/** */
BASELINE = BOTTOM;
/** */
CLOSE = 'close';
/** */
POINTS = 'points';
/** */
LINES = 'lines';
/** */
TRIANGLES = 'triangles';
/** */
OPEN = 'open';
/** */
CHORD = 'chord';
/** */
PIE = 'pie';
/** */
MIDDLE = -10;
/** */
CORNER = 'CORNER';
/** */
CORNERS = 'CORNERS';
/** */
CENTER = 'center';
/** */
RADIUS = 'radius';
/** */
RGB = 'rgb';
/** */
HSB = 'hsb';
/** */
HSL = 'hsl';
/** */
BLEND = 'source-over';
/** */
REMOVE = 'destination-out';
/** */
ADD = 'lighter';
/** */
DARKEST = 'darken';
/** */
LIGHTEST = 'lighten';
/** */
DIFFERENCE = 'difference';
/** */
SUBTRACT = 'subtract';
/** */
EXCLUSION = 'exclusion';
/** */
MULTIPLY = 'multiply';
/** */
SCREEN = 'screen';
/** */
REPLACE = 'copy';
/** */
OVERLAY = 'overlay';
/** */
HARD_LIGHT = 'hard-light';
/** */
SOFT_LIGHT = 'soft-light';
/** */
DODGE = 'color-dodge';
/** */
BURN = 'color-burn';
/** */
NO_COLOR = -1;
/** */
mouseX = 0;
/** */
mouseY = 0;
/** */
pmouseX = 0;
/** */
pmouseY = 0;
/** */
winMouseX = 0;
/** */
winMouseY = 0;
/** */
pwinMouseX = 0;
/** */
pwinMouseY = 0;
/** */
mouseButton = 0;
/** */
mouseIsPressed = false;
/** */
keyIsPressed = false;
/** */
key = null;
/** */
keyCode = null;

/** */
function exit() { };
/** */
function loop() { };
/** */
function noLoop() { };
/** */
function redraw() { };
/** */
function displayDensity() { };
/**
 * 
 * @param {*} ms 
 */
function delay(ms) { };
/**
 * 
 * @param {*} what 
 */
function printArray(what) { };
/**
 * 
 * @param {*} fname 
 * @param {*} data 
 */
function saveStrings(fname, data) { };
/**
 * 
 * @param {*} fname 
 * @param {*} data 
 */
function saveBytes(fname, data) { };
/**
 * 
 * @param {*} fname 
 */
function loadStrings(fname) { };
/**
 * 
 * @param {*} fname 
 */
function loadBytes(fname) { };
/** */
function push() { };
/** */
function pop() { };
function blendMode(mode) { };
/** */
function cursor() { };
/** */
function noCursor() { };
/** */
function size() { };
/** */
function createCanvas() { };
/** */
function smooth() { };
/** */
function noSmooth() { };
/** */
function settings() { };
/** */
function tint() { };
/** */
function noTint() { };
/**
 * 
 * @param {*} c 
 */
function alpha(c) { };
/**
 * 
 * @param {*} c 
 */
function blue(c) { };
/**
 * 
 * @param {*} c 
 */
function brightness(c) { };
/** */
function color() { };
/**
 * 
 * @param {*} c 
 */
function green(c) { };
/**
 * 
 * @param {*} c 
 */
function hue(c) { };
/**
 * 
 * @param {*} c1 
 * @param {*} c2 
 * @param {*} amt 
 */
function lerpColor(c1, c2, amt) { };
/**
 * 
 * @param {*} c 
 */
function lightness(c) { };
/**
 * 
 * @param {*} c 
 */
function red(c) { };
/**
 * 
 * @param {*} c 
 */
function saturation(c) { };
/** */
function background() { };
/** */
function clear() { };
/**
 * 
 * @param {*} mode 
 * @param {*} max1 
 * @param {*} max2 
 * @param {*} max3 
 * @param {*} maxA 
 */
function colorMode(mode, max1, max2, max3, maxA) { };
/** */
function fill() { };
/** */
function noFill() { };
/** */
function noStroke() { };
/** */
function stroke() { };
/**
 * 
 * @param {*} s 
 */
function print(s) { };
/**
 * 
 * @param {*} s 
 */
function println(s) { };
/**
 * 
 * @param {*} r
 */
function frameRate(r) { };
/** */
function getFrameRate() { };
/** */
function fullScreen() { };
/** */
function pixelDensity() { };
/** */
function getURL() { };
/** */
function getURLPath() { };
/** */
function getURLParams() { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createVector(x, y, z) { };
/**
 * 
 * @param {*} v 
 */
function abs(v) { };
/**
 * 
 * @param {*} v 
 */
function ceil(v) { };
/**
 * 
 * @param {*} n 
 * @param {*} low 
 * @param {*} high 
 */
function constrain(n, low, high) { };
/** */
function dist() { };
/**
 * 
 * @param {*} v 
 */
function exp(v) { };
/**
 * 
 * @param {*} v 
 */
function floor(v) { };
/**
 * 
 * @param {*} start 
 * @param {*} stop 
 * @param {*} amt 
 */
function lerp(start, stop, amt) { };
/**
 * 
 * @param {*} v 
 */
function log(v) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function mag(x, y) { };
/**
 * 
 * @param {*} n 
 * @param {*} start1 
 * @param {*} stop1 
 * @param {*} start2 
 * @param {*} stop2 
 * @param {*} withinBounds 
 */
function map(n, start1, stop1, start2, stop2, withinBounds) { };
/** */
function max() { };
/** */
function min() { };
/**
 * 
 * @param {*} n 
 * @param {*} start 
 * @param {*} stop 
 */
function norm(n, start, stop) { };
/**
 * 
 * @param {*} v 
 */
function pow(v) { };
/**
 * 
 * @param {*} v 
 */
function round(v) { };
/**
 * 
 * @param {*} n 
 */
function sq(n) { };
/**
 * 
 * @param {*} v 
 */
function sqrt(v) { };
/**
 * 
 * @param {*} seed 
 */
function randomSeed(seed) { };
/**
 * 
 * @param {*} min 
 * @param {*} max 
 */
function random(min, max) { };
/**
 * 
 * @param {*} mean 
 * @param {*} sd 
 */
function randomGaussian(mean, sd) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function noise(x, y, z) { };
/**
 * 
 * @param {*} lod 
 * @param {*} falloff 
 */
function noiseDetail(lod, falloff) { };
/**
 * 
 * @param {*} seed 
 */
function noiseSeed(seed) { };
/**
 * 
 * @param {*} ratio 
 */
function acos(ratio) { };
/**
 * 
 * @param {*} ratio 
 */
function asin(ratio) { };
/**
 * 
 * @param {*} ratio 
 */
function atan(ratio) { };
/**
 * 
 * @param {*} y 
 * @param {*} x 
 */
function atan2(y, x) { };
/**
 * 
 * @param {*} angle 
 */
function cos(angle) { };
/**
 * 
 * @param {*} angle 
 */
function sin(angle) { };
/**
 * 
 * @param {*} angle 
 */
function tan(angle) { };
/**
 * 
 * @param {*} angle 
 */
function degrees(angle) { };
/**
 * 
 * @param {*} angle 
 */
function radians(angle) { };
/**
 * 
 * @param {*} mode 
 */
function angleMode(mode) { };
/**
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function line(x1, y1, x2, y2) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function point(x, y) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 */
function ellipse(x, y, w, h) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 */
function circle(x, y, r) { };
/**
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} x3 
 * @param {*} y3 
 * @param {*} x4 
 * @param {*} y4 
 */
function quad(x1, y1, x2, y2, x3, y3, x4, y4) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 */
function rect(x, y, w, h) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} s 
 */
function square(x, y, s) { };
/**
 * 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} x3 
 * @param {*} y3 
 */
function triangle(x1, y1, x2, y2, x3, y3) { };
/**
 * 
 * @param {*} m 
 */
function beginShape(m) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function vertex(x, y) { };
/**
 * 
 * @param {*} p 
 */
function endShape(p) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 * @param {*} start 
 * @param {*} end 
 * @param {*} style 
 */
function arc(x, y, w, h, start, end, style) { };
/**
 * 
 * @param {*} m 
 */
function rectMode(m) { };
/**
 * 
 * @param {*} m 
 */
function ellipseMode(m) { };
/**
 * 
 * @param {*} w 
 */
function strokeWeight(w) { };
/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 * @param {*} d 
 * @param {*} e 
 * @param {*} f 
 */
function applyMatrix(a, b, c, d, e, f) { };
/**
 * 
 */
function resetMatrix() { };
/**
 * 
 * @param {*} angle 
 */
function rotate(angle) { };
/**
 * 
 * @param {*} angle 
 */
function shearX(angle) { };
/**
 * 
 * @param {*} angle 
 */
function shearY(angle) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function translate(x, y, z) { };
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function scale(x, y, z) { };
/**
 * 
 * @param {*} array 
 * @param {*} value 
 */
function append(array, value) { };
/**
 * 
 * @param {*} src 
 * @param {*} srcPosition 
 * @param {*} dst 
 * @param {*} dstPosition 
 * @param {*} length 
 */
function arrayCopy(src, srcPosition, dst, dstPosition, length) { };
/**
 * 
 * @param {*} list0 
 * @param {*} list1 
 */
function concat(list0, list1) { };
/**
 * 
 * @param {*} list 
 */
function reverse(list) { };
/**
 * 
 * @param {*} list 
 */
function shorten(list) { };
/**
 * 
 * @param {*} arr 
 * @param {*} bool 
 */
function shuffle(arr, bool) { };
/**
 * 
 * @param {*} list 
 * @param {*} count 
 */
function sort(list, count) { };
/**
 * 
 * @param {*} list 
 * @param {*} value 
 * @param {*} index 
 */
function splice(list, value, index) { };
/**
 * 
 * @param {*} list 
 * @param {*} start 
 * @param {*} count 
 */
function subset(list, start, count) { };
/**
 * 
 * @param {*} str 
 */
function float(str) { };
/**
 * 
 * @param {*} n 
 * @param {*} radix 
 */
function int(n, radix) { };
/**
 * 
 * @param {*} n 
 */
function str(n) { };
/**
 * 
 * @param {*} n 
 */
function boolean(n) { };
/**
 * 
 * @param {*} n 
 */
function byte(n) { };
/**
 * 
 * @param {*} n 
 */
function char(n) { };
/**
 * 
 * @param {*} n 
 */
function unchar(n) { };
/**
 * 
 * @param {*} n 
 * @param {*} digits 
 */
function hex(n, digits) { };
/**
 * 
 * @param {*} n 
 */
function unhex(n) { };
/**
 * 
 * @param {*} list 
 * @param {*} separator 
 */
function join(list, separator) { };
/**
 * 
 * @param {*} str 
 * @param {*} reg 
 */
function match(str, reg) { };
/**
 * 
 * @param {*} str 
 * @param {*} reg 
 */
function matchAll(str, reg) { };
/**
 * 
 * @param {*} nums 
 * @param {*} left 
 * @param {*} right 
 */
function nf(nums, left, right) { };
/**
 * 
 * @param {*} num 
 * @param {*} right 
 */
function nfc(num, right) { };
/** */
function nfp() { };
/** */
function nfs() { };
/**
 * 
 * @param {*} str 
 * @param {*} delim 
 */
function split(str, delim) { };
/**
 * 
 * @param {*} value 
 * @param {*} delims 
 */
function splitTokens(value, delims) { };
/**
 * 
 * @param {*} str 
 */
function trim(str) { };
/** */
function day() { };
/** */
function hour() { };
/** */
function minute() { };
/** */
function millis() { };
/** */
function month() { };
/** */
function second() { };
/** */
function year() { };
/**
 * 
 * @param {*} key 
 * @param {*} value 
 */
function createStringDict(key, value) { };
/**
 * 
 * @param {*} key 
 * @param {*} value 
 */
function createNumberDict(key, value) { };
