/**
 * @type StatInfo
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
class StatInfo { }

/**
 * @type MemInfo
 * @property {number} total total amount of memory in the system.
 * @property {number} remaining number of available bytes.
 */
class MemInfo { }

/**
 * @type FreeInfo
 * @property {number} availClusters available clusters on drive.
 * @property {number} totalClusters total clusters on drive.
 * @property {number} bytesPerSector bytes per sector.
 * @property {number} bytesPerCluster sectors per cluster.
 */
class FreeInfo { }
