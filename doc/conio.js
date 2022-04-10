/**
 * Console IO functions.
 * 
 * @module conio
 */

/**
* @property {number} color for TextColor() and TextBackground().
*/
BLACK = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
BLUE = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
GREEN = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
CYAN = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
RED = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
MAGENTA = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
BROWN = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTGRAY = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
DARKGRAY = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTBLUE = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTGREEN = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTCYAN = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTRED = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
LIGHTMAGENTA = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
YELLOW = 0;
/**
* @property {number} color for TextColor() and TextBackground().
*/
WHITE = 0;

/**
* @property {number} cursor type definition for SetCursorType(). No cursor is displayed.
*/
NOCURSOR = 0;
/**
* @property {number} cursor type definition for SetCursorType(). A solid block is displayed.
*/
SOLIDCURSOR = 0;
/**
* @property {number} cursor type definition for SetCursorType(). An underline cursor is displayed.
*/
NORMALCURSOR = 0;

/**
* @property {number} text mode definition for TextMode(). The text mode which was in effect before the last call to textmode().
*/
LASTMODE = 0;
/**
* @property {number} text mode definition for TextMode(). 40-column black and white (on a color screen).
*/
BW40 = 0;
/**
* @property {number} text mode definition for TextMode(). 40-color color.
*/
C40 = 0;
/**
* @property {number} text mode definition for TextMode(). 80-column black and white (on a color screen).
*/
BW80 = 0;
/**
* @property {number} text mode definition for TextMode(). 80-column color.
*/
C80 = 0;
/**
* @property {number} text mode definition for TextMode(). The monochrome monitor.
*/
MONO = 0;
/**
* @property {number} text mode definition for TextMode(). 80-column, 43- (on EGAs) or 50-row (on VGAs) color.
*/
C4350 = 0;

/**
 * Set text color.
 * @param {number} col the color.
 */
function TextColor(col) { }

/**
 * Set background color.
 * @param {number} col the color.
 */
function TextBackground(col) { }

/**
 * Set dim character mode.
 */
function LowVideo() { }

/**
 * Set bright character mode.
 */
function HighVideo() { }

/**
 * Clear until end of current line.
 */
function ClearEol() { }

/**
 * Clear screen.
 */
function ClearScreen() { }

/**
 * Delete current line, lines below scroll up.
 */
function DeleteLine() { }

/**
 * Insert a line at current cursor position, the current line and lines below scroll down.
 */
function InsertLine() { }

/**
 * Get a string from the console (including editing function).
 * @returns {string} the string entered.
 */
function CGets() { }

/**
 * Write string to current cursor position.
 * @param {string} str 
 */
function CPuts(str) { }

/**
 * get a character w/o echo.
 * @returns {string} the character.
 */
function GetCh() { }

/**
 * get a character w/ echo.
 * @returns {string} the character.
 */
function GetChE() { }

/**
 * return a character to input buffer.
 * @param {string} the character.
 */
function UngetCh(ch) { }

/**
 * put a character on the screen.
 * @param {string} the character.
 */
function PutCh(ch) { }

/**
 * Change type of cursor.
 * @param {number} type 
 */
function SetCursorType(type) { }

/**
 * Change text mode.
 * @param {number} mode mode.
 */
function TextMode(mode) { }

/**
 * Set cursor position, starts at (1,1).
 * @param {number} x 
 * @param {number} y 
 */
function GotoXY(x, y) { }

/**
 * Cursor x position (starts at 1).
 * @returns {number} x position.
 */
function WhereX() { }

/**
 * Cursor y position (starts at 1).
 * @returns {number} y position.
 */
function WhereY() { }

/**
 * Get max number of screen rows (height).
 */
function ScreenRows() { }

/**
 * Get max number of screen columns (width).
 */
function ScreenCols() { }

/**
 * Flash the screen.
 */
function ScreenVisualBell() { }

/**
 * convert a character code into a string containing that character.
 * @param {number} charCode character code.
 * @returns {string} a string with that character.
 */
function AsciiCharDef(charCode) { }

/**
 * Enable/disable automatic scrolling on the screen.
 * @param {boolean} ena true to enable scrolling, false to disable it.
 */
function EnableScrolling(ena) { }

/**
 * Waits for the user to press one key, then returns that key. Alt-key combinations have 0x100 added to them, and extended keys have 0x200 added to them.
 * @returns {number} key code.
 */
function GetXKey() { }

/**
 * Set 16 background color mode.
 */
function IntenseVideo() { }

/**
* Set 8 background color mode with blinking.
*/
function BlinkVideo() { }
