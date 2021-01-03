/********
 * File
 */
/**
 * Open a file, for file modes see {@link FILE}. Files can only either be read or written, never both. Writing to a closed file throws an exception.
 * @class
 * @param {string} filename the name of the file.
 * @param {FILE} mode READ, WRITE or APPEND.
 */
function File(filename, mode) { }
/**
 * Read a single byte from file and return it as number.
 * @returns {number} the byte as a number or null for EOF.
 */
File.prototype.ReadByte = function () { };
/**
 * Write a single byte to a file.
 * @param {number} ch the byte to write.
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
/**
 * get file contents as number array.
 * @returns {number[]} the remaining contents of the file as array of numbers.
 */
File.prototype.ReadBytes = function () { };
/**
 * get file size.
 * @returns {number} the size of the file in bytes.
 */
File.prototype.GetSize = function () { };
/**
 * Write a bytes to a file.
 * @param {number[]} data the data to write as array of numbers (must be integers between 0-255).
 */
File.prototype.WriteBytes = function (data) { };

/********
 * COMPort
 */
/**
 * Open a COM port.
 * Note: COM port functions must be activated/loaded by calling LoadLibrary("comport")!
 * 
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

/********
 * Socket
 */
/**
 * @class
 */
function Socket() { }

/**
 * flush the socket output to the network.
 */
Socket.prototype.Flush = function () { };

/**
 * close the socket.
 * @param {boolean} [doFlush=false] flush before close.
 */
Socket.prototype.Close = function (doFlush) { }

/**
 * Wait until all written data is flushed.
 */
Socket.prototype.WaitFlush = function () { }

/**
 * Wait on socket for incoming data with timeout.
 * @param {boolean} [timeout=1] max wait time.
 */
Socket.prototype.WaitInput = function (timeout) { }

/**
 * Get the next byte from the socket as number.
 * @returns {number} the next byte from the socket.
 */
Socket.prototype.ReadByte = function () { }

/**
 * write a byte to a socket.
 * @param {number} ch the byte to write.
 */
Socket.prototype.WriteByte = function (ch) { }

/**
 * send binary data.
 * @param {number[]} data data to write as number array.
 */
Socket.prototype.WriteBytes = function (data) { }

/**
 * send string.
 * @param {string} str data to send.
 */
Socket.prototype.WriteString = function (str) { }

/**
 * Set binary or ascii mode for UDP/TCP sockets.
 * @param {number} mode one of SOCKET.MODE.
 */
Socket.prototype.Mode = function (mode) { }

/**
 * Send pending TCP data.
 * @param {boolean} [flushWait=false] wait until data is flushed.
 */
Socket.prototype.Flush = function (flushWait) { }

/**
 * Sets non-flush mode on next TCP write.
 */
Socket.prototype.NoFlush = function () { }

/**
 * Causes next transmission to have a flush (PUSH bit set).
 */
Socket.prototype.FlushNext = function () { }

/**
 * Get number of bytes waiting to be read.
 * @returns {number} number of bytes waiting to be read.
 */
Socket.prototype.DataReady = function () { }

/**
 * Check if the socket connection is established.
 * @returns {boolean} true if the connection is established.
 */
Socket.prototype.Established = function () { }

/**
 * Get the remote host ip
 * @returns {IpAddress} IP of the remote host.
 */
Socket.prototype.GetRemoteHost = function () { }

/**
 * Get the local port number.
 * @returns {number} the local port number.
 */
Socket.prototype.GetLocalPort = function () { }

/**
 * Get the remote port number.
 * @returns {number} the remote port number.
 */
Socket.prototype.GetRemotePort = function () { }

/**
 * Return the next line from the socket as string.
 * This method blocks until a newline is read.
 * @returns {string} the next line from the socket as string.
 */
Socket.prototype.ReadLine = function () { }

/**
 * Return data as string.
 * This method blocks until 'len' bytes have been read.
 * 
 * @param {number} len number of bytes to read from socket.
 * 
 * @returns {string} data as string.
 */
Socket.prototype.ReadString = function (len) { }

/**
 * Return data as array of numbers.
 * This method blocks until 'len' bytes have been read.
 * 
 * @param {number} len number of bytes to read from socket.
 * 
 * @returns {number[]} data as array.
 */
Socket.prototype.ReadBytes = function (len) { }

/********
 * Zip
 */
/**
 * Open a ZIP, for file modes see {@link ZIPFILE}.
 * @class
 * @param {string} filename the name of the file.
 * @param {FILE} mode READ, WRITE or APPEND.
 * @param {number} [compression] 1..9 to specify compression level.
 */
function Zip(filename, mode, compression) { }
/**
 * close ZIP.
 */
Zip.prototype.Close = function () { };
/**
 * get number of entries in ZIP.
 * 
 * @returns {number} number of entries in this ZIP.
 */
Zip.prototype.NumEntries = function () { };
/**
 * get an array with the file entries in the ZIP.
 * 
 * @returns {*} an array containing the file entries of the ZIP in the following format:
 * @example
 * [
 *      [name:string, is_directory:bool, size:number, crc32:number],
 *      ...
 * ]
 */
Zip.prototype.GetEntries = function () { };
/**
 * add a file to a ZIP.
 * 
 * @param {string} zip_name the full path the file shall have in the ZIP.
 * @param {string} hdd_name the full path to the file to add.
 */
Zip.prototype.AddFile = function (zip_name, hdd_name) { };
/**
 * extract a file from a ZIP.
 * 
 * @param {string} zip_name the full path of the file in the ZIP.
 * @param {string} hdd_name the full path the extracted file should have on the HDD.
 */
Zip.prototype.ExtractFile = function (zip_name, hdd_name) { };
/**
 * get file contents as number array.
 * @param {string} zip_name the full path of the file in the ZIP.
 * @returns {number[]} the content of the file as array of numbers.
 */
Zip.prototype.ReadBytes = function (zip_name) { };
/**
 * Write a bytes to a file in the ZIP.
 * @param {string} zip_name the full path of the file in the ZIP.
 * @param {number[]} data the data to write as array of numbers (must be integers between 0-255).
 */
Zip.prototype.WriteBytes = function (zip_name, data) { };
