/********
 * properties
 */

/**
 * @property {object} global the global context.
 */
global = null;

/**
 * Other properties
 * 
 * @module other
 */

/**
 * @property {number} JSH_VERSION the version
 */
JSH_VERSION = 0.0;

/**
 * @property {boolean} LFN_SUPPORTED true if long filenames are supported.
 */
LFN_SUPPORTED = false;

/**
 * @property {string[]} ARGS the command line arguments including the script name.
 */
ARGS = [];

/**
 * Load and initialize a native library (DXE). Native libraries must reside in the directory jSH.EXE was started from!
 * 
 * @param {string} name the base name of the library (e.g. if the library is called "foo.dxe" on disk you need to call LoadLibrary("foo")).
 */
function LoadLibrary(name) { }

/**
 * Get a list of loaded native libraries.
 * 
 * @returns {string[]} a list of loaded libraries.
 */
function GetLoadedLibraries() { }

/**
 * Flushes, closes and re-opens the current logfile. This is useful if you want to read the current logfile contents from a runing program.
 */
function FlushLog() { }

/**
 * @param {string} varname the name of the variable
 * 
 * @returns {string} the value of the var or NULL if it does not exists.
 */
function GetEnv(varname) { }

/**
 * IPX network functions.
 * 
 * **Note: IPX module must be loaded by calling LoadLibrary("ipx") before using!**
 * 
 * @module ipx
 */
/**
 * Open an IPX socket. See {@link IPX} for DEFAULT_SOCKET.
 * @param {*} num the socket number to use.
 * 
 */
function IpxSocketOpen(num) { }

/**
 * Close IPX socket (if any).
 */
function IpxSocketClose() { }

/**
 * Send packet via IPX. Max length 79 byte. Node addresses are arrays of 6 numbers between 0-255. See {@link IPX} for BROADCAST address.
 * @param {string} data data to send.
 * @param {IpxAddress} dest destination address.
 */
function IpxSend(data, dest) { }

/**
 * Check for packet in receive buffer.
 * @returns {boolean} true if a packet is available.
 */
function IpxCheckPacket() { }

/**
 * Get packet from receive buffer(or NULL).
 * @returns {IpxPacket} a data packet or null if none available.
 */
function IpxGetPacket() { }

/**
 * Get the local address.
 * @returns {IpxAddress} an array containing the own address.
 */
function IpxGetLocalAddress() { }

/**
 * @module other
 */
/**
 * Write data to JSLOG.TXT logfile.
 * @param {string} s the string to print.
 */
function Debug(s) { }

/**
 * Write data to JSLOG.TXT logfile with a newline.
 * @param {string} s the string to print.
 */
function Debugln(s) { }

/**
 * Exit jSH.
 * 
 * @param {number} [code] exit code to return to DOS.
 */
function Quit(code) { }

/**
 * Write data to stdout.
 * @param {string} s the string to print.
 */
function Print(s) { }

/**
 * Write data to stdout with a newline.
 * @param {string} s the string to print.
 */
function Println(s) { }

/**
 * Controls the handling of CTRL-C/BREAK.
 * Note:
 *  - MS-DOS and FreeDOS do support it, but only if the program reads/writes from/to the console
 *  - DOSBox-X does support it, but only if the program does reads from the console (this will be fixed to behave like MS-DOS/FreeDOS)
 *  - plain DOSBox does not support CTRL-C/CTRL-BREAK at all
 * 
 * @param {boolean} enable true to enable CTRL-C/BREAK handling (default) or false to suppress it.
 */
function CtrlBreak(enable) { }

/**
 * Sleep for the given number of ms.
 * @param {number} ms time to sleep.
 */
function Sleep(ms) { }

/**
 * Get ms timestamp.
 * @returns {number} ms time.
 */
function MsecTime() { }

/**
 * File-IO functions.
 * 
 * @module fileio
 */

/**
 * check for existence of a file.
 * @param {string} filename name of file to check.
 * @returns {boolean} true if the file exists, else false.
 */
function FileExists(filename) { }

/**
* check for existence of a directory.
* @param {string} dirname name of directory to check.
* @returns {boolean} true if the directory exists, else false.
*/
function DirExists(dirname) { }

/**
* Load the contents of a file into a string. Throws exception if loading fails.
* @param {string} filename name of file to read.
* @returns {string} the contents of the file.
* @throws Throws an error if reading fails.
*/
function Read(filename) { }

/**
 * Load the contents of a ZIP file entry into a string. Throws exception if loading fails.
 * @param {string} filename name of file to read.
 * @param {string} entryname name of entry in the ZIP file to read.
 * @returns {string} the contents of the file.
 * @throws Throws an error if reading fails.
 */
function ReadZIP(filename, entryname) { }

/**
 * Get directory listing.
 * @param {string} dname name of directory to list.
 * @returns {string[]} array of entry names.
 * @throws Throws an error if listing fails.
 */
function List(dname) { }

/**
 * rename file/directory.
 * @param {string} from old name
 * @param {string} to new name
 */
function Rename(from, to) { }

/**
 * remove a directory (must be empty).
 * @param {string} name path/name of the directory.
 */
function RmDir(name) { }

/**
 * remove a file.
 * @param {string} name path/name of the file.
 */
function RmFile(name) { }

/**
 * make a directory.
 * @param {string} name path/name of the new directory
 */
function MakeDir(name) { }

/**
 * Get free space info on drive.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {FreeInfo} drive space info object.
 */
function FreeSpace(drvNum) { }

/**
 * Check if drive is a fixed drive.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {boolean} true if this is a fixed drive, else false.
 */
function IsFixed(drvNum) { }

/**
 * Check if drive is a CD-ROM.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {boolean} true if this is a CD-ROM, else false.
 */
function IsCDROM(drvNum) { }

/**
 * Check if drive was formated with FAT32.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {boolean} true if this is a FAT32 volume, else false.
 */
function IsFAT32(drvNum) { }

/**
 * Check if drive is a RAM disk.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {boolean} true if this is a RAM disk, else false.
 */
function IsRAMDisk(drvNum) { }

/**
 * determine file system type.
 * @param {number} drvNum Number of the drive (0=default, 1=A:, 2 == B:, etc).
 * @returns {string} file system type.
 */
function GetFSType(drvNum) { }

/**
 * Get information about a file / directory.
 * @param {string} name name of the file to get info for.
 * @returns {StatInfo} an info object.
 * @throws Throws an error if stat fails.
 */
function Stat(name) { }

/**
 * This function determine the current default drive.
 * This is a wrapper for DOS IN21, ah=0Eh.
 * 
 * @returns the current default drive (1=A:, 2=B:, etc.). 
 */
function GetDrive() { }

/**
 * This function canonicalizes the input path.
 * The path is canonicialized by removing consecutive and trailing slashes, 
 * making the path absolute if it's relative by prepending the current drive
 * letter and working directory, removing "." components, collapsing ".." 
 * components, adding a drive specifier if needed, and converting all slashes to '/'. 
 * DOS-style 8+3 names of directories which are part of the pathname, as well as its
 * final filename part, are returned lower-cased, but long filenames are left intact.
 * 
 * @param {string} path 
 * @returns a path.
 */
function RealPath(path) { }

/**
 * This function set the current default drive based on drive (1=A:, 2=B:, etc.) and determines the number of available logical drives.
 * This is a wrapper for DOS IN21, ah=19h.
 * 
 * @param {number} drive the new default drive.
 * 
 * @returns the number of available logical drives.
 */
function SetDrive(drive) { }

/**
 * Run garbage collector, print statistics to logfile if 'info==true'.
 * @param {boolean} info true to print collection stats to logfile.
 */
function Gc(info) { }

/**
 * Get information system memory.
 * @returns {MemInfo} an info object.
 */
function MemoryInfo() { }

/**
 * Stop playing sound.
 */
function NoSound() { }

/**
 * Play a sound with given frequency using the PC speaker.
 * @param {number} freq sound frequency.
 */
function Sound(freq) { }

/**
 * Run given commandline.
 * @param {string} cmd command line.
 * @returns {number} exit code of command.
 */
function System(cmd) { }

/**
 * write a byte value to a hardware io-port.
 * @param {number} port port address to write to.
 * @param {number} value 8-bit value to write to port.
 */
function OutPortByte(port, value) { }

/**
 * write a word value to a hardware io-port.
 * @param {number} port port address to write to.
 * @param {number} value 16-bit value to write to port.
 */
function OutPortWord(port, value) { }

/**
 * write a long value to a hardware io-port.
 * @param {number} port port address to write to.
 * @param {number} value 32-bit value to write to port.
 */
function OutPortLong(port, value) { }

/**
 * read a byte value from a hardware io-port.
 * @param {number} port port address to read from.
 * @returns {number} 8-bit value read from port.
 */
function InPortByte(port) { }

/**
 * read a word value from a hardware io-port.
 * @param {number} port port address to read from.
 * @returns {number} 16-bit value read from port.
 */
function InPortWord(port) { }

/**
 * read a long value from a hardware io-port.
 * @param {number} port port address to read from.
 * @returns {number} 32-bit value read from port.
 */
function InPortLong(port) { }

/**
 * get available parallel ports.
 * @returns {number[]} list of available parallel ports and their addresses.
 */
function GetParallelPorts() { }

/**
 * get available serial ports.
 * @returns {number[]} list of available serial ports and their addresses.
 */
function GetSerialPorts() { }

/**
 * Convert byte array to ASCII string. The string is terminated at the first NULL byte or at array length (whichever comes first).
 * 
 * @param {number[]} data array of numbers.
 * @returns {string} a string.
 */
function BytesToString(data) { }

/**
 * Convert ASCII string to byte array.
 * 
 * @param {string} str string to convert.
 * @returns {number[]} array of numbers.
 */
function StringToBytes(str) { }

/**
 * parse a string into a function. Works like Function() by a source file name can be provided.
 * 
 * @param {string} p name of the single parameter.
 * @param {string} s the source of the function.
 * @param {string} [f] an optional filename where the source came from.
 */
function NamedFunction(p, s, f) { }

/**
 * @module tcpip
 */

/**
 * get the local IP address.
 * @returns {IpAddress} the local IP address as an array of numbers
 */
function GetLocalIpAddress() { }
/**
 * get the netmask.
 * @returns {IpAddress} the netmask as an array of numbers
 */
function GetNetworkMask() { }
/**
 * get the hostname.
 * @returns {string} the hostname
 */
function GetHostname() { }
/**
 * get the domain name.
 * @returns {string} the domain name
 */
function GetDomainname() { }
/**
 * look up a hostname in DNS.
 * @param {string} host the hostname.
 * @returns {IpAddress} The IP address of the host or an exception.
 */
function Resolve(host) { }
/**
 * reverse look up a host in DNS.
 * @param {IpAddress} ip the ip address.
 * @returns {string} The name of the host or an exception.
 */
function ResolveIp(ip) { }

/**
 * RawWrite() only works when DOjS was started with "-x"
 * @module rawdisk
 */

/**
 * @returns {number} number of FDD found in system.
 */
function GetNumberOfFDD() { }

/**
 * @returns {number} number of HDD found in system.
 */
function GetNumberOfHDD() { }

/**
 * query the status if a given disk.
 * 
 * @param {number} disk 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
 * 
 * @returns {number} disk status.
 * 
 * @see http://www.ctyme.com/intr/rb-0606.htm
 */
function GetDiskStatus(disk) { }

/**
 * get number of (LBA) sectors for a drive.
 * 
 * @param {number} drive 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
 * 
 * @returns {number} number of sectors for that disk.
 */
function GetRawSectorSize(drive) { }

/**
 * read a disk sector.
 * 
 * @param {number} disk 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
 * @param {number} sector number 0..GetRawSectorSize()
 * 
 * @returns {number[]} an array with 512 bytes.
 */
function RawRead(disk, sector) { }

/**
 * write a disk sector.
 * RawWrite() only works when DOjS was started with "-x"
 * 
 * @param {number} disk 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
 * @param {number} sector number 0..GetRawSectorSize()
 * @param {number[]} data an array with 512 bytes.
 */
function RawWrite(disk, sector, data) { }
