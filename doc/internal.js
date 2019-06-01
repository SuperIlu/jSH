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
