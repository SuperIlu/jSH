/********
 * properties
 */

/**
 * @property {string[]} command line arguments
 */
args = [];

/**
 * @property {object} global the global context.
 */
global = null;

/**
 * @property {number} JSH_VERSION the version
 */
JSH_VERSION = 0.0;

/**
 * General functions.
 * @module general
 */

/**
 * Load and initialize a native library (DXE). Native libraries must reside in the directory jSH.EXE was started from!
 * 
 * @param {string} name the base name of the library (e.g. if the library is called "foo.dxe" on disk you need to call LoadLibrary("foo")).
 */
function LoadLibrary(name) { }

/**
 * Get a list of loaded native libraries.
 * 
 * @return {string[]} a list of loaded libraries.
 */
function GetLoadedLibraries() { }

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
 */
function Quit() { }

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
 * Run given commandline.
 * @param {string} cmd command line.
 * @returns {number} exit code of command.
 */
function System(cmd) { }

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
 * File-IO functions.
 * 
 * @module fileio
 */

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
 * Get information about a file / directory.
 * @param {string} name name of the file to get info for.
 * @returns {StatInfo} an info object.
 * @throws Throws an error if stat fails.
 */
function Stat(name) { }

/**
 * Sleep for the given number of s.
 * @param {number} s time to sleep.
 */
function Sleep(s) { }

/**
 * Remove a file.
 * @param {string} name name of the file.
 * @throws Throws an error if the file could not be removed.
 */
function RmFile(name) { }

/**
 * Remove a directory. The directory must be empty.
 * @param {string} name name of the directory.
 * @throws Throws an error if the directory could not be removed.
 */
function RmDir(name) { }

/**
 * Rename file or directory.
 * @param {string} from old name.
 * @param {string} to new name.
 * @throws Throws an error if renaming fails.
 */
function Rename(from, to) { }

/**
 * Create a directory.
 * @param {string} name name of new directory.
 * @throws Will throw an error if the directory could not be created.
 */
function Makedir(name) { }

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
 * @param {IpAddress} host the ip address.
 * @returns {string} The name of the host or an exception.
 */
function ResolveIp(ip) { }

/**
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
 * @param {number} disk 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
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
 * 
 * @param {number} disk 0..GetNumberOfFDD() for FDD (0..GetNumberOfHDD())+RAW_HDD_FLAG for HDD.
 * @param {number} sector number 0..GetRawSectorSize()
 * @param {number[]} data an array with 512 bytes.
 */
function RawWrite(disk, sector, data) { }
