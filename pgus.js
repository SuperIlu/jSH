var CONTROL_PORT = 0x1D0;
var DATA_PORT_LOW = 0x1D1;
var DATA_PORT_HIGH = 0x1D2;
var PICOGUS_PROTOCOL_VER = 1;

function banner() {
	printf("JavaScript PicoGUSinit v1.0.1\n");
	printf("(c) 2023 Ian Scott - licensed under the GNU GPL v2\n\n");
	printf("Javascript version (c) 2023 SuperIlu - licensed under the GNU GPL v2\n\n");
}

function err_pigus() {
	Println("ERROR: no PicoGUS detected!");
}


function err_protocol(expected, got) {
	Println("ERROR: PicoGUS card using protocol " + expected + ", needs " + got);
	Println("Please run the latest PicoGUS firmware and pgusinit.exe versions together!");
}

function print_firmware_string() {
	OutPortByte(CONTROL_PORT, 0xCC); // Knock on the door...
	OutPortByte(CONTROL_PORT, 0x02); // Select firmware string register

	var firmware_string = "";
	for (var i = 0; i < 255; ++i) {
		var ch = InPortByte(DATA_PORT_HIGH);
		if (ch > 0) {
			firmware_string += String.fromCharCode(ch);
		} else {
			break;
		}
	}
	Println("Firmware version: " + firmware_string);
}

function init_gus() {
	var port = 0x240;

	OutPortByte(CONTROL_PORT, 0x04); // Select port register
	OutPortWord(DATA_PORT_LOW, port); // Write port

	// Detect if there's something GUS-like...
	// Set memory address to 0
	OutPortByte(port + 0x103, 0x43);
	OutPortWord(port + 0x104, 0x0);
	OutPortByte(port + 0x103, 0x44);
	OutPortWord(port + 0x104, 0x0);
	// Write something
	OutPortByte(port + 0x107, 0xDD);
	// Read it and see if it's the same
	if (InPortByte(port + 0x107) != 0xDD) {
		Println("ERROR: Card not responding to GUS commands on port " + port.toString(16));
		Quit(1);
	}
	Println("GUS-like card detected on port " + port.toString(16) + "...");

	// Enable IRQ latches
	OutPortByte(port, 0x8);
	// Select reset register
	OutPortByte(port + 0x103, 0x4C);
	// Master reset to run. DAC enable and IRQ enable will be done by the application.
	OutPortByte(port + 0x105, 0x1);
}

//////
// main
var buffer_size = 0;
var dma_interval = 0;
var port_override = 0;

// Get magic value from port on PicoGUS that is not on real GUS
OutPortByte(CONTROL_PORT, 0xCC); // Knock on the door...
OutPortByte(CONTROL_PORT, 0x00); // Select magic string register
if (InPortByte(DATA_PORT_HIGH) != 0xDD) {
	err_pigus();
	Quit(1);
};

Println("PicoGUS detected: ");
print_firmware_string();

OutPortByte(CONTROL_PORT, 0x01); // Select protocol version register
var protocol_got = InPortByte(DATA_PORT_HIGH);
if (PICOGUS_PROTOCOL_VER != protocol_got) {
	err_protocol(PICOGUS_PROTOCOL_VER, protocol_got);
	Quit(1);
}

OutPortByte(CONTROL_PORT, 0x03); // Select mode register
var mode = InPortByte(DATA_PORT_HIGH);

var port;
if (mode != 0) {
	OutPortByte(CONTROL_PORT, 0x04); // Select port register
	port = InPortWord(DATA_PORT_LOW); // Get port
}

switch (mode) {
	case 0:
		init_gus();
		var buffer_size = 16;
		OutPortByte(CONTROL_PORT, 0x10); // Select audio buffer register
		OutPortByte(DATA_PORT_HIGH, (buffer_size - 1));
		Println("Audio buffer size set to " + buffer_size + " samples");

		OutPortByte(CONTROL_PORT, 0x11); // Select DMA interval register
		OutPortByte(DATA_PORT_HIGH, dma_interval);
		if (dma_interval == 0) {
			Println("DMA interval set to default behavior");
		} else {
			Println("DMA interval forced to " + dma_interval + " us");
		}
		OutPortByte(CONTROL_PORT, 0x04); // Select port register
		port = InPortWord(DATA_PORT_LOW); // Get port
		Println("Running in GUS mode on port " + port.toString(16));
		break;
	case 1:
		Println("Running in AdLib/OPL2 mode on port " + port.toString(16));
		break;
	case 2:
		Println("Running in MPU-401 mode on port " + port.toString(16));
		break;
}
Println("PicoGUS initialized!\n");
