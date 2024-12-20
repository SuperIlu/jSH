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
Println("This is jSH: Hello World!");

Println("arguments=" + JSON.stringify(ARGS));

Println("Key_ESC=" + K_Escape);

// create file with text
var fw1 = new File("test1.fil", FILE.WRITE);
for (var i = 0; i < 10; i++) {
    fw1.WriteLine("Line " + i);
}
fw1.Close();
fw1 = null;
Gc();
Gc();

// copy file linewise
var fw2 = new File("test2.fil", FILE.WRITE);
var fr1 = new File("test1.fil", FILE.READ);
while (true) {
    var l = fr1.ReadLine();
    if (l == null) {
        break;
    }
    fw2.WriteString(l);
}
fr1.Close();
fw2.Close();
fr1 = null;
fw2 = null;
Gc();
Gc();

for (var i = 0; i < 3; i++) {
    var fname = "tst." + i;
    var f = new File(fname, FILE.WRITE);
    f.WriteLine("File " + i);
    Println(f.name);
    f.Close();
    f = null;
    Gc();
    Gc();
    RmFile(fname);
}


// rename file
Rename("test2.fil", "test3.fil");

// delete file
RmFile("test1.fil");
