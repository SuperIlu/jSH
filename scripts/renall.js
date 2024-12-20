/*
MIT License

Copyright (c) 2019-2021 Andre Seidelt <superilu@yahoo.com>

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
if (ARGS.length < 3) {
	Println("Usage:");
	Println("   jSH.exe renall.js <dir> <old ext> <new ext>");
	Exit(1);
}

var dir = ARGS[0];
var oldExt = ARGS[1].toUpperCase();
var newExt = ARGS[2].toUpperCase();

var files = List(dir);
for (var i = 0; i < files.length; i++) {
	var oldName = files[i].toUpperCase();
	if (oldName.lastIndexOf(oldExt) != -1) {
		var baseName = oldName.substring(0, oldName.lastIndexOf(oldExt));
		var newName = baseName + newExt;
		Println(dir + "\\" + oldName + " => " + dir + "\\" + newName);
		Rename(dir + "\\" + oldName, dir + "\\" + newName);
	}
}
Println("All done...");
