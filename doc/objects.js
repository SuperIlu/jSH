/**
 * Node addresses are arrays of 6 numbers between 0-255 (e.g. [1, 2, 3, 4, 5, 6]).
 * @typedef {object} IpcAddress
 */
class IpxAddress { }

/**
 * received IPX data packet.
 * @typedef {object} IpxPacket
 * @property {string} data the received data.
 * @property {IpxAddress} source address of the sending node.
 */
class IpxPacket { }

/**
 * @typedef {object} StatInfo
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
 * @typedef {object} MemInfo
 * @property {number} total total amount of memory in the system.
 * @property {number} remaining number of available bytes.
 */
class MemInfo { }

/**
 * @typedef {object} FreeInfo
 * @property {number} availClusters available clusters on drive.
 * @property {number} totalClusters total clusters on drive.
 * @property {number} bytesPerSector bytes per sector.
 * @property {number} bytesPerCluster sectors per cluster.
 */
class FreeInfo { }

/**
 * An array with four numbers (e.g. [192.168.1.2]).
 * @typedef {object} IpAdddress
 */
class IpAddress { }

/**
 * An array with the HTTP result: [code, message, header, data]
 * @typedef {object} HTTPResult
 */
class HTTPResult { }

/**
 * complex object containing the state information for all buttons and sticks.
 * "-1" means "not available"
 * @example
{
	"brand_str": "",
	"cpu_clock": 55,
	"cpu_clock_measure": 62,
	"cpu_codename": "i486 DX-25/33",
	"ext_family": 4,
	"ext_model": 0,
	"family": 4,
	"features": [
		"fpu"
	],
	"l1_data_assoc": -1,
	"l1_data_cache": -1,
	"l1_data_cacheline": -1,
	"l1_instruction_assoc": -1,
	"l1_instruction_cache": -1,
	"l1_instruction_cacheline": -1,
	"l2_assoc": -1,
	"l2_cache": -1,
	"l2_cacheline": -1,
	"l3_assoc": -1,
	"l3_cache": -1,
	"l3_cacheline": -1,
	"l4_assoc": -1,
	"l4_cache": -1,
	"l4_cacheline": -1,
	"model": 0,
	"num_cores": 1,
	"num_logical_cpus": 1,
	"sse_size": -1,
	"stepping": 2,
	"total_logical_cpus": 1,
	"vendor": 0,
	"vendor_str": "GenuineIntel"
}
 * @typedef {object} CpuInfo
 */
class CpuInfo { }
