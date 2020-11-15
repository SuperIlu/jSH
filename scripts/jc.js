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

// setup conio screen
TextMode(C80);
EnableScrolling(false);

var dirLeft = initDirInfo("C:/");
var dirRight = initDirInfo("C:/BUILD/");

var paneWidth = ScreenCols() / 2;

var drives = getDriveLetters();

main();

function main() {
	var keepRunning = true;
	var leftActive = true;
	var current = dirLeft;

	drawCommands();
	while (keepRunning) {
		buildPane(dirLeft, 1, paneWidth, leftActive);
		buildPane(dirRight, paneWidth + 1, paneWidth, !leftActive);

		var keyCode = GetXKey();
		switch (keyCode) {
			case K_F10:
				keepRunning = false;
				break;

			case K_Down:
			case K_EDown:
				if (current.cursor < current.list.length - 1) {
					current.cursor++;
					current.redraw = true;
				}
				break;

			case K_Up:
			case K_EUp:
				if (current.cursor > 0) {
					current.cursor--;
					current.redraw = true;
				}
				break;

			case K_F3:
				var n = current.list[current.cursor];
				var i = current.info[n];
				if (i.is_regular) {
					viewFile(concatPath(current.path, n));
					drawCommands();
					dirLeft.redraw = true;
					dirRight.redraw = true;
				}
				break;

			case K_F5:
			case K_F6:
			case K_F7:
			case K_F8:
				showMessage("Not yet implemented");
				Sleep(2);
				dirLeft.redraw = true;
				dirRight.redraw = true;
				break;

			case K_Alt_F1:
				switchDrive(dirLeft);
				break;

			case K_Alt_F2:
				switchDrive(dirRight);
				break;

			// switch pane
			case K_Tab:
				leftActive = !leftActive;
				dirLeft.redraw = true;
				dirRight.redraw = true;
				if (leftActive) {
					current = dirLeft;
				} else {
					current = dirRight;
				}
				break;

			case K_Return:
				var n = current.list[current.cursor];
				var i = current.info[n];
				if (n == ".." || i.is_directory) {
					current.path = concatPath(current.path, n);
					updateDir(current);
					updateCursor(current, n);
				}
				current.redraw = true;
				break;

			default:
				Println("Unknown key=" + Number(keyCode).toString(16));
				break;
		}
	}

	TextColor(LIGHTGRAY);
	TextBackground(BLACK);
	ClearScreen();
}

/**
 * handle drive switching for panes.
 * 
 * @param {object} dir the dir structure.
 */
function switchDrive(dir) {
	var d = askDrive(dir.path);
	if (d) {
		dir.path = d;
		dir.oldCursors = [];
		updateDir(dir);
	}
	dirLeft.redraw = true;
	dirRight.redraw = true;
}

/**
 * select new drive from available drives.
 * 
 * @param {string} old old path.
 * @returns new drive or null if nothing changed.
 */
function askDrive(old) {
	old = old.substring(0, 1);
	var newDrive = old;

	while (true) {
		TextColor(LIGHTCYAN);
		TextBackground(BLUE);
		var width = drives.length * 5 + drives.length + 1;
		var x = (ScreenCols() - width) / 2;
		GotoXY(x, ScreenRows() / 2 - 1);
		PutCh(ULCORNER);
		while (WhereX() < x + width) {
			PutCh(HLINE);
		}
		PutCh(URCORNER);

		GotoXY(x, ScreenRows() / 2);
		PutCh(VLINE);
		CPuts(" ");
		for (var d = 0; d < drives.length; d++) {
			TextBackground(LIGHTCYAN);
			if (newDrive == drives[d]) {
				TextColor(YELLOW);
				CPuts("[ " + drives[d] + " ]");
			} else {
				TextColor(LIGHTCYAN);
				CPuts("  " + drives[d] + "  ");
			}
			TextColor(LIGHTCYAN);
			TextBackground(BLUE);
			CPuts(" ");
		}
		PutCh(VLINE);

		GotoXY(x, ScreenRows() / 2 + 1);
		PutCh(LLCORNER);
		while (WhereX() < x + width) {
			PutCh(HLINE);
		}
		PutCh(LRCORNER);
		var keyCode = GetXKey();
		switch (keyCode) {
			case K_Escape:
				return null;

			case K_Left:
			case K_ELeft:
				var idx = drives.indexOf(newDrive);
				idx--;
				if (idx < 0) {
					newDrive = drives[drives.length - 1];
				} else {
					newDrive = drives[idx]
				}
				break;

			case K_Right:
			case K_ERight:
				var idx = drives.indexOf(newDrive);
				idx++;
				if (idx > drives.length - 1) {
					newDrive = drives[0];
				} else {
					newDrive = drives[idx]
				}
				break;

			case K_Return:
				if (newDrive != old) {
					return newDrive + ":/";
				} else {
					return null;
				}
		}
	}
}

/**
 * return a list of available drive letters
 * 
 * @returns {string[]} list of drive letters.
 */
function getDriveLetters() {
	var ret = [];
	for (var x = 1; x <= 26; x++) {
		var space = FreeSpace(x);
		if (space.availClusters != 0 || space.bytesPerCluster != 0 || space.bytesPerSector != 0 || space.totalClusters != 0) {
			ret.push(String.fromCharCode(x + 64));
		}
	}
	return ret;
}

/**
 * update cursor position from history (if any).
 * 
 * @param {*} dir current dir.
 * @param {*} n new directory name.
 */
function updateCursor(dir, n) {
	if (n == ".." && dir.oldCursors.length > 0) {
		dir.cursor = dir.oldCursors.pop();
	} else {
		dir.oldCursors.push(dir.cursor);
		dir.cursor = 0;
	}
}

/**
 * draw command info line at bottom of screen.
 */
function drawCommands() {
	var cmds = ['', '', 'View', '', 'Copy', 'RenMov', 'Mkdir', 'Delete', '', 'Quit'];

	GotoXY(1, ScreenRows());
	for (var i = 0; i < cmds.length; i++) {
		var c = cmds[i];
		TextColor(LIGHTGRAY);
		TextBackground(BLACK);
		if (i != 0) {
			CPuts(" ");
		}
		CPuts((i + 1).toString());
		TextColor(BLACK);
		TextBackground(LIGHTCYAN);
		CPuts(c);
		while (WhereX() < (i + 1) * 8) {
			CPuts(" ");
		}
	}
}

/**
 * concatenate path with directory, handle ".." for parent directory.
 * 
 * @param {*} orig current path, must end with a "/"
 * @param {*} sub directory to concatenate or ".." for parent.
 */
function concatPath(orig, sub) {
	if (sub == "..") {
		var parts = orig.split("/");
		if (parts.length > 2) {
			parts.splice(-2, 1);
			return parts.join("/");
		} else {
			return orig;	// this is just a drive letter
		}
	} else {
		return orig + sub + "/";
	}
}

function initDirInfo(dir) {
	var ret = {
		redraw: true,
		path: dir,
		oldCursors: [],
		cursor: 0,
		rows: ScreenRows() - 3,
		list: [],
		info: {}
	};
	updateDir(ret);
	return ret;
}

function updateDir(dir) {
	showMessage("Reading " + dir.path + "...");
	dir.list = List(dir.path);
	var self = dir.list.indexOf(".");
	dir.list.splice(self, 1);
	for (var l = 0; l < dir.list.length; l++) {
		var name = dir.list[l];
		if (name == "MUJS-1.0.5") {
			continue;
		}
		dir.info[name] = Stat(dir.path + "/" + name);
	}

	if (dirLeft && dirRight) {
		dirLeft.redraw = true;
		dirRight.redraw = true;
	}
}

function buildPane(dir, start, width, active) {
	if (dir.redraw) {
		TextColor(LIGHTCYAN);
		TextBackground(BLUE);
		GotoXY(start, 1);
		PutCh(ULCORNER);
		PutCh(HLINE);
		PutCh(HLINE);
		CPuts(dir.path);
		while (WhereX() < start + width - 1) {
			PutCh(HLINE);
		}
		PutCh(URCORNER);
		var topIdx = 0;
		var curPos = dir.cursor;
		if (curPos >= dir.rows - 1) {
			topIdx = dir.cursor - dir.rows + 1;
			curPos = dir.rows - 1;
		}
		for (var y = 2; y < ScreenRows() - 1; y++) {
			if (active && curPos == y - 2) {
				TextColor(BLUE);
				TextBackground(LIGHTCYAN);
			} else {
				TextColor(LIGHTCYAN);
				TextBackground(BLUE);
			}
			GotoXY(start, y);
			CPuts(VLINE + " ");

			var n = dir.list[y - 2 + topIdx];
			CPuts(formatEntry(n, dir.info[n]));

			GotoXY(start + width - 2, y);
			CPuts(" " + VLINE);
		}
		TextColor(LIGHTCYAN);
		TextBackground(BLUE);
		GotoXY(start, y);
		PutCh(LLCORNER);
		for (var x = start + 1; x < start + width - 1; x++) {
			PutCh(HLINE);
		}
		PutCh(LRCORNER);
	}
	dir.redraw = false;
}

// screen := 80
// pane   := 40
// row    := 36
// fname     = 20
// seperator =  3
// size      = 13
function formatEntry(name, info) {
	if (name) {
		// Debug(name);
		var n = name.substring(0, 21);
		n = (n + "                    ").substring(0, 21);

		if (info) {
			if (info.is_directory) {
				var s = "<DIR>";
			} else {
				var s = "" + info.size;
			}
		} else {
			var s = "";
		}
		s = ("              " + s).slice(-12);

		return n + " " + VLINE + " " + s;
	} else {
		return "                      " + VLINE + "              ";
	}
}

function copyFile(src, dst) {

}

function viewFile(src) {
	showMessage("Loading " + src + "...");
	var f = new File(src, "r");
	var data = [];
	while (true) {
		var l = f.ReadLine();
		if (l) {
			data.push(l.trim());
		} else {
			break;
		}
	}

	var top = 0;
	while (true) {
		// headline with filename
		GotoXY(1, 1);
		TextColor(BLACK);
		TextBackground(LIGHTCYAN);
		CPuts(src);
		fillLine();

		// draw content
		TextColor(WHITE);
		TextBackground(BLUE);
		for (var y = 2; y <= ScreenRows(); y++) {
			GotoXY(1, y);
			var idx = y - 2 + top;
			if (idx < data.length) {
				CPuts(data[idx]);
			}
			fillLine();
		}

		var keyCode = GetXKey();
		switch (keyCode) {
			case K_Escape:
				return;

			case K_Up:
			case K_EUp:
				if (top > 0) {
					top--;
				}
				break;

			case K_Down:
			case K_EDown:
				if (top + ScreenRows() - 1 < data.length - 1) {
					top++;
				}
				break;
		}
	}
}

function fillLine() {
	while (WhereX() < ScreenCols()) {
		CPuts(" ");
	}
	CPuts(" ");
}

function showMessage(msg) {
	TextColor(LIGHTCYAN);
	TextBackground(BROWN);
	var width = msg.length + 2;
	var x = Math.floor((ScreenCols() - width) / 2);
	var end = x + width;

	GotoXY(x, ScreenRows() / 2 - 1);
	PutCh(ULCORNER);
	while (WhereX() <= end) {
		PutCh(HLINE);
	}
	PutCh(URCORNER);

	GotoXY(x, ScreenRows() / 2);
	PutCh(VLINE);
	CPuts(" ");
	CPuts(msg);
	CPuts(" ");
	PutCh(VLINE);

	GotoXY(x, ScreenRows() / 2 + 1);
	PutCh(LLCORNER);
	while (WhereX() <= end) {
		PutCh(HLINE);
	}
	PutCh(LRCORNER);
}
