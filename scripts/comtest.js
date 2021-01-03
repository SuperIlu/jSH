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

LoadLibrary("comport");

Println(JSON.stringify(COM));
Debugln(JSON.stringify(COM));

function dump_obj(o) {
	for (var key in o) {
		Debug(key);
		Debug(", ");
	}
	Debugln("");
}

dump_obj(COM.PORT);
dump_obj(COM.BAUD);
dump_obj(COM.BIT);
dump_obj(COM.PARITY);
dump_obj(COM.STOP);
dump_obj(COM.FLOW);

var comX = new COMPort(COM.PORT.COM1, COM.BAUD.B115200, COM.BIT.BITS_8, COM.PARITY.NO_PARITY, COM.STOP.STOP_1, COM.FLOW.NO_CONTROL);
var com2 = new COMPort(COM.PORT.COM2, COM.BAUD.B115200, COM.BIT.BITS_8, COM.PARITY.NO_PARITY, COM.STOP.STOP_1, COM.FLOW.NO_CONTROL);
Println("Ports opened");

comX.Close();
Println("COM1 closed");

var com1 = new COMPort(COM.PORT.COM1, COM.BAUD.B115200, COM.BIT.BITS_8, COM.PARITY.NO_PARITY, COM.STOP.STOP_1, COM.FLOW.NO_CONTROL);
Println("COM1 re-opened");

var keepRunning = true;
while (keepRunning) {
	if (KbHit()) {
		var keyCode = GetXKey();
		switch (keyCode) {
			case K_Escape:
				keepRunning = false;
				break;
			default:
				Println("Wrote=" + com1.Write("" + keyCode));
				Debugln("Wrote=" + com1.Write("" + keyCode));
				break;
		}
	} else {
		if (!com2.IsInputEmpty()) {
			Println(com2.ReadChar());
			Debugln(com2.ReadChar());
		}
	}
}
Println("Exiting...");
Debugln("Exiting...");

com1.Close();
com2.Close();
Println("Done...");
