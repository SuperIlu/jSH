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
var testfile = "testz.zip";

var z = new Zip(testfile, "w");
z.AddFile("file1", "scripts/zip.js");
z.AddFile("dir1/file2", "scripts/zip.js");
z.WriteBytes("memfile.bin", StringToBytes("This is a test of the emergency broadcast system!"));
z.WriteBytes("test.js", StringToBytes("function x(){}"));
z.Close();
Println("Added files to ZIP");

var x = new Zip(testfile, "r");
Println("Opened ZIP with " + x.NumEntries());
Println(JSON.stringify(x.GetEntries()));
x.ExtractFile("file1", "tst1.tmp");
x.ExtractFile("dir1/file2", "tst2.tmp");
Println(BytesToString(x.ReadBytes("memfile.bin")));
x.Close();
Println("Extracted two files from ZIP");

Println(JSON.stringify(Require("jsboot/file.js")));
Println(JSON.stringify(Require(testfile + "=test.js")));

RmFile("tst1.tmp");
RmFile("tst2.tmp");
