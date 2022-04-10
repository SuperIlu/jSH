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
/**
 * get file contents as number IntArray.
 * @returns {IntArray} the remaining contents of the file as IntArray.
 */
File.prototype.ReadInts = function () { };
/**
 * Write a bytes to a file.
 * @param {IntArray} data the data to write as IntArray (must be integers between 0-255).
 */
File.prototype.WriteInts = function (data) { };

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
/**
 * Return data as IntArray.
 * This method blocks until 'len' bytes have been read.
 * 
 * @param {number} len number of bytes to read from socket.
 * 
 * @returns {IntArray} data as IntArray.
 */
Socket.prototype.ReadInts = function (len) { }
/**
 * send binary data.
 * @param {IntArray} data data to write as IntArray.
 */
Socket.prototype.WriteInts = function (data) { }

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
/**
 * get file contents as IntArray.
 * @param {string} zip_name the full path of the file in the ZIP.
 * @returns {IntArray} the content of the file as IntArray.
 */
Zip.prototype.ReadInts = function (zip_name) { };
/**
* remove file from ZIP.
* @param {string} zip_name the full path of the file to remove from ZIP.
*/
Zip.prototype.DeleteFile = function (zip_name) { };
/**
 * Write a bytes to a file in the ZIP.
 * @param {string} zip_name the full path of the file in the ZIP.
 * @param {IntArray} data the data to write as IntArray (must be integers between 0-255).
 */
Zip.prototype.WriteInts = function (zip_name, data) { };

/**
 * Create a cURL instance for HTTP requests.
 * 
 * **Note: cURL module must be loaded by calling LoadLibrary("curl") before using!**
 * 
 * @class
 */
function Curl() { }
/**
 * Set HTTP proxy to use. The parameter should be a string holding the host name or dotted IP address.
 * To specify port number in this string, append :[port] to the end of the host name. The proxy 
 * string may be prefixed with [protocol]:// since any such prefix will be ignored. 
 * The proxy's port number may optionally be specified with the separate function SetProxyPort().
 * 
 * @param {string} proxy the proxy.
 */
Curl.prototype.SetProxy = function (proxy) { };
/**
 * Pass a long with this option to set the proxy port to connect to unless it is specified in the proxy string using SetProxy().
 * 
 * @param {number} port the port number.
 */
Curl.prototype.SetProxyPort = function (port) { };
/**
 * Pass a string which should be [username]:[password] to use for BASIC_AUTH the connection to the HTTP proxy.
 * 
 * @param {string} user_pw basic auth authentication string to the proxy.
 */
Curl.prototype.SetProxyUser = function (user_pw) { };
/**
 * Switch between SOCKS and HTTP proxies.
 * 
 * @param {boolean} isSocks true to use a SOCKS proxy, false for an HTTP proxy.
 */
Curl.prototype.SetSocksProxy = function (isSocks) { };
/**
 * Pass string, which should be [username]:[password] to use for the connection. Using a colon with no password will make libcurl use an empty password.
 * might perform several requests to possibly different hosts. libcurl will only send this user and password information to hosts using the initial host
 * name (unless SetUnrestrictedAuth(true) is set), so if libcurl follows locations to other hosts it will not send the user and password to those.
 * This is enforced to prevent accidental information leakage.
 * @param {string} user_pw the username/password combination to use for BASIC_AUTH.
 */
Curl.prototype.SetUserPw = function (user_pw) { };
/**
 * This string will be used to set the User-Agent: header in the http request sent to the remote server.
 * This can be used to fool servers or scripts. You can also set any custom header with AddHeader().
 * Default: "cURL-DOjS <version>"
 * 
 * @param {string} agent the agent string to use.
 */
Curl.prototype.SetUserAgent = function (agent) { };
/**
 * This string will be used to set the Referer: header in the http request sent to the remote server.
 * This can be used to fool servers or scripts. You can also set any custom header with AddHeader().
 * 
 * @param {string} referer referer string to use.
 */
Curl.prototype.SetReferer = function (referer) { };
/**
 * The set number will be the redirection limit. If that many redirections have been followed, the next redirect will cause an error (CURLE_TOO_MANY_REDIRECTS).
 * This option only makes sense if the SetFollowLocation() is used at the same time.
 * @param {number} maximum max redirects
 */
Curl.prototype.SetMaxRedirs = function (maximum) { };
/**
 * A boolean parameter to tell the library it can continue to send authentication (user+password) when following locations, even when hostname changed.
 * Note that this is meaningful only when setting SetFollowLocation(true).
 * @param {boolean} unrestricted true to no not restrict authentication, false to restrict.
 */
Curl.prototype.SetUnrestrictedAuth = function (unrestricted) { };
/**
 * A boolean parameter to tell the library to follow any Location: header that the server sends as part of a HTTP header.
 * 
 * @param {boolean} doFollow true to follow redirects, false to ignore them.
 */
Curl.prototype.SetFollowLocation = function (doFollow) { };
/**
 * Pass a pointer to a zero terminated string as parameter. It will be used to set a cookie in the http request. 
 * The format of the string should be NAME=CONTENTS, where NAME is the cookie name and CONTENTS is what the cookie should contain.
 * If you need to set mulitple cookies, you need to set them all using a single option and thus you need to concat them all 
 * in one single string. Set multiple cookies in one string like this: "name1=content1;name2=content2;" etc. 
 * Using this option multiple times will only make the latest string override the previously ones.
 * 
 * @param {string} cookies a cookie string.
 */
Curl.prototype.SetCookies = function (cookies) { };
/**
 * The string should be the file name of your private key.
 * 
 * @param {string} key name of the PEM key file.
 */
Curl.prototype.SetKey = function (key) { };
/**
 * It will be used as the password required to use the SetKey() private key.
 * 
 * @param {string} key_pw password for key file.
 */
Curl.prototype.SetKeyPassword = function (key_pw) { };
/**
 * The string should be the file name of your certificate.
 * 
 * @param {string} cert name of the PEM cert file.
 */
Curl.prototype.SetCertificate = function (cert) { };
/**
 * It will be used as the password required to use the SetCertificate() certificate.
 * 
 * @param {string} cer_pw password for key file.
 */
Curl.prototype.SetCertificatePassword = function (cer_pw) { };
/**
 * A string naming a file holding one or more certificates to verify the peer with.
 * Default: "cacert.pem"
 * 
 * @param {string} cafile PEM cainfo file.
 */
Curl.prototype.SetCaFile = function (cafile) { };
/**
 * It should contain the maximum time in seconds that you allow the connection to the server to take. 
 * This only limits the connection phase, once it has connected, this option is of no more use. 
 * Set to zero to disable connection timeout (it will then only timeout on the system's internal timeouts). 
 * See also the SetTimeout() option.
 * 
 * @param {number} timeout the timeout in seconds.
 */
Curl.prototype.SetConnectTimeout = function (timeout) { };
/**
 * The maximum time in seconds that you allow the libcurl transfer operation to take. 
 * Normally, name lookups can take a considerable time and limiting operations to less than a few minutes risk aborting perfectly normal operations.
 * 
 * @param {number} timeout the timeout in seconds.
 */
Curl.prototype.SetTimeout = function (timeout) { };
/**
 * Pass false to stop curl from verifying the peer's certificate.
 * 
 * @param {boolean} verify true to verify the peers certificates, false to ignore certificate errors.
 */
Curl.prototype.SetSslVerify = function (verify) { };
/**
 * Add a header in the form "Name:Value" to all requests done with this instance of Curl.
 * If you add a header that is otherwise generated and used by libcurl internally, your added one will be used instead. 
 * If you add a header with no contents as in 'Accept:' (no data on the right side of the colon), the internally used 
 * header will get disabled. Thus, using this option you can add new headers, replace internal headers and remove internal headers.
 * The headers must not be CRLF-terminated, because curl adds CRLF after each header item. Failure to comply with this will result in strange bugs because the server will most likely ignore part of the headers you specified.
 * 
 * @param {string} header a header to add.
 */
Curl.prototype.AddHeader = function (header) { };
/**
 * Clear all currently used headers previously set using AddHeader().
 */
Curl.prototype.ClearHeaders = function () { };
/**
 * Switch this Curl instance to HTTP_GET (the default).
 */
Curl.prototype.SetGet = function () { };
/**
 * Switch this Curl instance to HTTP_POST.
 * post_data should be the full data to post in a HTTP post operation. 
 * This data will be sent with every request until either HTTP_POST is disabled using SetGet() or new data ist set using this method.
 * You need to make sure that the data is formatted the way you want the server to receive it. 
 * libcurl will not convert or encode it for you. Most web servers will assume this data to be url-encoded (see urlencode()). Take note.
 * @see urlencode()
 *
 * @param {string} post_data the POST data to send.
 */
Curl.prototype.SetPost = function (post_data) { };
/**
 * Switch this Curl instance to HTTP_PUT. 
 * This data will be sent with every request until either HTTP_PUT is disabled using SetGet() or new data ist set using this method.
 * 
 * @param {IntArray} put_data the PUT data to send.
 */
Curl.prototype.SetPut = function (put_data) { };
/**
 * @return {string} return the last effectively used URL.
 */
Curl.prototype.GetLastUrl = function () { };
/**
 * @return {number} get the last generated response code.
 */
Curl.prototype.GetResponseCode = function () { };
/**
 * perform a request with all settings previously set using the other methods.
 * 
 * @param {string} url the URL to connect to.
 * 
 * @returns {IntArray[]} An array with two IntArrays and the response code. The first (index 0) contains the request body, the second (index 1) the request headers and the third (index 2) the response code.
 */
Curl.prototype.DoRequest = function (url) { };

/**
 * screen backbuffer.
 * 
 * @class
 */
function Screen() { }

/**
 * copy contents of the current display to this screen.
 */
Screen.prototype.FromDisplay = function () { }

/**
 * copy contents of this screen to the display.
 */
Screen.prototype.ToDisplay = function () { }

/**
 * clear the screen with current background color.
 */
Screen.prototype.Clear = function () { }

/**
 * Set background color.
 * @param {number} col the color.
 * @see TextBackground()
 */
Screen.prototype.TextBackground = function (color) { }
/**
 * Set text color.
 * @param {number} col the color.
 * @see TextColor()
 */
Screen.prototype.TextColor = function (color) { }

/**
 * add text to the Screen. the text is added with the current text/background color of the Screen. x/y coordinates are 1-based (like with GotoXY()).
 * 
 * @param {number} x x start coordinate
 * @param {number} y y start coordinate
 * @param {string} str text to add.
 * 
 * @see GotoXY()
 */
Screen.prototype.Put = function (x, y, str) { }

/**
 * add text to the Screen. the text is added with the current text/background color of the Screen. x/y coordinates are 0-based.
 * 
 * @param {number} x x start coordinate
 * @param {number} y y start coordinate
 * @param {string} str text to add.
 * 
 * @see GotoXY()
 */
Screen.prototype.Put0 = function (x, y, str) { }
