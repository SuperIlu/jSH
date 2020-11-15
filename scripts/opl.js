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
function WriteOPL(reg, val) {
	// Select register
	OutPortByte(0x388, reg);
	// Wait for card to accept value
	for (var i = 1; i < 25; i++) {
		InPortByte(0x388);
	}
	// Send value
	OutPortByte(0x389, val);
	// Wait for card to accept value
	for (var i = 1; i < 100; i++) {
		InPortByte(0x388);
	}
}

function DetectCard() {
	var A, B;

	WriteOPL(1, 0);
	WriteOPL(4, 0x60);
	WriteOPL(4, 0x80);
	A = InPortByte(0x388);
	WriteOPL(2, 0xFF);
	WriteOPL(4, 0x21);
	B = InPortByte(0x388);
	WriteOPL(4, 0x60);
	WriteOPL(4, 0x80);
	if ((A & 0xE0) == 0 && (B & 0xE0) == 0xC0) {
		return true;
	} else {
		return false;
	}
}

function ResetCard() {
	for (var i = 0x01; i < 0xF5; i++) {
		WriteOPL(i, 0);
	}
}

function TestSound() {
	WriteOPL(0x20, 0x01); // Set the modulator's multiple to 1
	WriteOPL(0x40, 0x10); // Set the modulator's level to about 40 dB
	WriteOPL(0x60, 0xF0); // Modulator attack: quick; decay: long
	WriteOPL(0x80, 0x77); // Modulator sustain: medium; release: medium
	WriteOPL(0xA0, 0x98); // Set voice frequency's LSB (it'll be a D#)
	WriteOPL(0x23, 0x01); // Set the carrier's multiple to 1
	WriteOPL(0x43, 0x00); // Set the carrier to maximum volume (about 47 dB)
	WriteOPL(0x63, 0xF0); // Carrier attack: quick; decay: long
	WriteOPL(0x83, 0x77); // Carrier sustain: medium; release: medium
	WriteOPL(0xB0, 0x31); // Turn the voice on; set the octave and freq MSB
	Sleep(1);
	WriteOPL(0xB0, 0x11); // turn the voice off
}

Println("Card detected=" + DetectCard());
ResetCard();
TestSound();
ResetCard();
