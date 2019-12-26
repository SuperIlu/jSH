/********
 * File
 */
/**
 * Open a file, for file modes see {@link FILE}. Files can only either be read or written, never both.Writing to a closed file throws an exception.
 * @class
 * @param {string} filename the name of the file.
 * @param {string} mode READ, WRITE or APPEND.
 */
function File(filename, mode) { }
/**
 * Read a single byte from file and return it as number.
 * @returns {number} the byte as a number or null for EOF.
 */
File.prototype.ReadByte = function () { };
/**
 * Write a single byte to a file.
 */
File.prototype.WriteByte = function (ch) { };
/**
 * Read a line of text from file. The maximum line length is 4096 byte.
 * @returns {string} the next line or null for EOF.
 */
File.prototype.ReadLine = function () { };
/**
 * Write a NEWLINE terminated string to a file.
 * @param {string} txt the string to write.
 */
File.prototype.WriteLine = function (txt) { };
/**
 * Write a string to a file.
 * @param {string} txt the string to write.
 */
File.prototype.WriteString = function (txt) { };
/**
 * Close the file.
 */
File.prototype.Close = function () { };

/********
 * COMPort
 */
/**
 * Open a COM port.
 * @class
 * @param {COM} port one of COM.PORT.x
 * @param {COM} baud one of COM.BAUD.x
 * @param {COM} bits one of COM.BIT.x
 * @param {COM} parity one of COM.PARITY.x
 * @param {COM} stop one of COM.STOP.x
 * @param {COM} flow one of COM.FLOW.x
 * @param {number} addr COM port address, optional.
 * @param {number} irq COM port IRQ, optional.
 */
function COMPort(port, baud, bits, parity, stop, flow, addr, irq) { }

/**
 * close the COM port.
 */
COMPort.prototype.Close = function () { };

/**
 * Flushes the input buffer.
 */
COMPort.prototype.FlushInput = function () { };

/**
 * Flushes the output buffer.
 */
COMPort.prototype.FlushOutput = function () { };

/**
 * check if there is data in the output buffer.
 * @returns {boolean} true if the buffer is empty.
 */
COMPort.prototype.IsOutputEmpty = function () { };

/**
 * check if the output buffer is full.
 * @returns {boolean} true if the buffer is full.
 */
COMPort.prototype.IsOutputFull = function () { };

/**
 * Write char to COM port.
 * @param {number} ch byte value to write.
 */
COMPort.prototype.WriteChar = function (ch) { };

/**
 * Write a string to COM port.
 * @param {string} str the string to send.
 * @returns {number} the amount of bytes written to the output buffer (might be less than string length).
 */
COMPort.prototype.Write = function (str) { };

/**
 * check if there is data in the input buffer.
 * @returns {boolean} true if the buffer is empty.
 */
COMPort.prototype.IsInputEmpty = function () { };

/**
 * check if the input buffer is full.
 * @returns {boolean} true if the buffer is full.
 */
COMPort.prototype.IsInputFull = function () { };

/**
 * read a char from input buffer.
 * @returns {number} a char as number or null if none available.
 */
COMPort.prototype.ReadChar = function () { };

/**
 * read a string from input buffer. Max length is 4096 byte.
 * @returns {string} a string composed from the input buffer. for an empty buffer "" is returned.
 */
COMPort.prototype.ReadBuffer = function () { };
