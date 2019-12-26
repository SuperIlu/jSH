/**
 * @property {string} atime file access timestamp.
 * @property {string} ctime file creation time.
 * @property {string} mtime file modification time.
 * @property {number} blksize file size in blocks.
 * @property {number} size file size in bytes.
 * @property {number} nlink number of sub entries.
 * @property {string} drive drive letter for the entry.
 * @property {boolean} is_blockdev true if this is a block device.
 * @property {boolean} is_chardev true if this is a character device.
 * @property {boolean} is_directory true if this is a directory.
 * @property {boolean} is_regular true if this is a regular file.
 */
StatInfo = {};

/**
 * @property {number} total total amount of memory in the system.
 * @property {number} remaining number of available bytes.
 */
MemInfo = {};

/**
 * @property {number} availClusters available clusters on drive.
 * @property {number} totalClusters total clusters on drive.
 * @property {number} bytesPerSector bytes per sector.
 * @property {number} bytesPerCluster sectors per cluster.
 */
FreeInfo = {};

/**
 * @property {number} PORT COM1, COM2, COM3, COM4, 
 * @property {number} BAUD B50, B75, B110, B134, B150, B200, B300, B600, B1200, B1800, B2400, B4800, B9600, B19200, B38400, B57600, B115200, 
 * @property {number} BIT BITS_5, BITS_6, BITS_7, BITS_8, 
 * @property {number} PARITY NO_PARITY, ODD_PARITY, EVEN_PARITY, MARK_PARITY, SPACE_PARITY, 
 * @property {number} FLOW	NO_CONTROL, XON_XOFF, RTS_CTS
 * @property {number} STOP STOP_1, STOP_2, 
 */
COM = {};
