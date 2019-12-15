/*
MIT License

Copyright (c) 2019 Andre Seidelt <superilu@yahoo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
#include <dirent.h>
#include <dos.h>
#include <dpmi.h>
#include <duktape.h>
#include <errno.h>
#include <pc.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

#include "funcs.h"
#include "jSH.h"

/*********************
** static functions **
*********************/
/**
 * @brief read a whole file as string.
 * Read(fname:string):string
 *
 * @param J the JS context.
 */
static duk_ret_t f_Read(duk_context *J) {
    const char *fname = duk_require_string(J, 0);
    FILE *f;
    char *s;
    int n, t;

    f = fopen(fname, "rb");
    if (!f) {
        return duk_generic_error(J, "Can't open file '%s': %s", fname, strerror(errno));
    }

    if (fseek(f, 0, SEEK_END) < 0) {
        fclose(f);
        return duk_generic_error(J, "Can't seek in file '%s': %s", fname, strerror(errno));
    }

    n = ftell(f);
    if (n < 0) {
        fclose(f);
        return duk_generic_error(J, "Can't tell in file '%s': %s", fname, strerror(errno));
    }

    if (fseek(f, 0, SEEK_SET) < 0) {
        fclose(f);
        return duk_generic_error(J, "Can't seek in file '%s': %s", fname, strerror(errno));
    }

    s = malloc(n + 1);
    if (!s) {
        fclose(f);
        return duk_generic_error(J, "out of memory");
    }

    t = fread(s, 1, n, f);
    if (t != n) {
        free(s);
        fclose(f);
        return duk_generic_error(J, "Can't read data from file '%s': %s", fname, strerror(errno));
    }
    s[n] = 0;

    duk_push_string(J, s);
    free(s);
    fclose(f);

    return 1;
}

/**
 * @brief get directory listing.
 * List(dname:string):[f1:string, f1:string, ...]
 *
 * @param J the JS context.
 */
static duk_ret_t f_List(duk_context *J) {
    const char *dirname = duk_require_string(J, 0);
    DIR *dir = opendir(dirname);
    if (!dir) {
        return duk_generic_error(J, "Cannot open dir '%s': %s", dirname, strerror(errno));
    }

    struct dirent *de;
    duk_idx_t arr = duk_push_array(J);
    int idx = 0;
    while ((de = readdir(dir)) != NULL) {
        duk_push_string(J, de->d_name);
        duk_put_prop_index(J, arr, idx);
        idx++;
    }

    closedir(dir);
    return 1;
}

/**
 * @brief convert time_t into something like a javascript time string.
 *
 * @param t the time_t
 *
 * @return char* pointer to a static buffer with the conversion result.
 */
static char *f_formatTime(time_t *t) {
    static char buf[100];
    struct tm *tm = localtime(t);
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S.000", tm);
    return buf;
}

/**
 * @brief file/directory info.
 * Stat(name:string):{}
 *
 * @param J the JS context.
 */
static duk_ret_t f_Stat(duk_context *J) {
    const char *name = duk_require_string(J, 0);

    struct stat s;
    if (stat(name, &s) != 0) {
        return duk_generic_error(J, "Cannot stat '%s': %s", name, strerror(errno));
    }

    char *drive = "A:";
    drive[0] += s.st_dev;

    duk_idx_t obj = duk_push_object(J);
    {
        duk_push_string(J, drive);
        duk_put_prop_string(J, obj, "drive");
        duk_push_string(J, f_formatTime(&s.st_atime));
        duk_put_prop_string(J, obj, "atime");
        duk_push_string(J, f_formatTime(&s.st_ctime));
        duk_put_prop_string(J, obj, "ctime");
        duk_push_string(J, f_formatTime(&s.st_mtime));
        duk_put_prop_string(J, obj, "mtime");
        duk_push_int(J, s.st_size);
        duk_put_prop_string(J, obj, "size");
        duk_push_int(J, s.st_blksize);
        duk_put_prop_string(J, obj, "blksize");
        duk_push_int(J, s.st_nlink);
        duk_put_prop_string(J, obj, "nlink");

        duk_push_boolean(J, S_ISREG(s.st_mode));
        duk_put_prop_string(J, obj, "is_regular");
        duk_push_boolean(J, S_ISDIR(s.st_mode));
        duk_put_prop_string(J, obj, "is_directory");
        duk_push_boolean(J, S_ISCHR(s.st_mode));
        duk_put_prop_string(J, obj, "is_chardev");
        duk_push_boolean(J, S_ISBLK(s.st_mode));
        duk_put_prop_string(J, obj, "is_blockdev");
    }

    return 1;
}

/**
 * @brief print to stdout with newline.
 * Println(t1, t2, ...)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Debugln(duk_context *J) {
    duk_get_global_string(J, "DEBUG");
    bool dbg = duk_require_boolean(J, -1);
    duk_pop(J);

    if (dbg) {
        duk_push_string(J, " ");
        duk_insert(J, 0);
        duk_join(J, duk_get_top(J) - 1);
        fputs(duk_to_string(J, -1), LOGSTREAM);
        fflush(LOGSTREAM);
        putc('\n', LOGSTREAM);
    }
    return 0;
}

/**
 * @brief print to stdout.
 * Print(t1, t2, ...)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Debug(duk_context *J) {
    duk_get_global_string(J, "DEBUG");
    bool dbg = duk_require_boolean(J, -1);
    duk_pop(J);

    if (dbg) {
        duk_push_string(J, " ");
        duk_insert(J, 0);
        duk_join(J, duk_get_top(J) - 1);
        fputs(duk_to_string(J, -1), LOGSTREAM);
        fflush(LOGSTREAM);
    }
    return 0;
}

/**
 * @brief print to stdout with newline.
 * Println(t1, t2, ...)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Println(duk_context *J) {
    duk_push_string(J, " ");
    duk_insert(J, 0);
    duk_join(J, duk_get_top(J) - 1);
    fputs(duk_to_string(J, -1), stdout);
    putc('\n', stdout);
    fflush(stdout);
    return 0;
}

/**
 * @brief print to stdout.
 * Print(t1, t2, ...)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Print(duk_context *J) {
    duk_push_string(J, " ");
    duk_insert(J, 0);
    duk_join(J, duk_get_top(J) - 1);
    fputs(duk_to_string(J, -1), stdout);
    fflush(stdout);
    return 0;
}

/**
 * @brief quit jSH.
 * Quit()
 *
 * @param J the JS context.
 */
static duk_ret_t f_Quit(duk_context *J) {
    exit(0);
    return 0;
}

/**
 * @brief do garbage collection.
 * Gc(report:boolean)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Gc(duk_context *J) {
    bool compact = duk_get_boolean(J, 0);
    duk_gc(J, compact ? DUK_GC_COMPACT : 0);
    return 0;
}

/**
 * @brief get memory info
 * MemoryInfo():{"used":XXX, "available":XXX}
 *
 * @param J the JS context.
 */
static duk_ret_t f_MemoryInfo(duk_context *J) {
    _go32_dpmi_meminfo info;

    duk_idx_t obj = duk_push_object(J);
    {
        if ((_go32_dpmi_get_free_memory_information(&info) == 0) && (info.total_physical_pages != -1)) {
            duk_push_int(J, info.total_physical_pages * 4096);
            duk_put_prop_string(J, obj, "total");
            duk_push_int(J, _go32_dpmi_remaining_physical_memory());
            duk_put_prop_string(J, obj, "remaining");
        }
    }
    return 1;
}

/**
 * @brief sleep for the given number of s.
 * Sleep(s:number)
 *
 * @param J the JS context.
 */
static duk_ret_t f_Sleep(duk_context *J) {
    sleep(duk_require_int(J, 0));
    return 0;
}

static duk_ret_t f_RmFile(duk_context *J) {
    const char *file = duk_require_string(J, 0);

    if (!file) {
        return duk_generic_error(J, "No filename");
    }

    int ret = unlink(file);
    if (ret != 0) {
        return duk_generic_error(J, "Could not delete file: %s", strerror(errno));
    }
    return 0;
}

static duk_ret_t f_RmDir(duk_context *J) {
    const char *dir = duk_require_string(J, 0);

    if (!dir) {
        return duk_generic_error(J, "No dirname");
    }

    int ret = rmdir(dir);
    if (ret != 0) {
        return duk_generic_error(J, "Could not delete directory: %s", strerror(errno));
    }
    return 0;
}

static duk_ret_t f_MakeDir(duk_context *J) {
    const char *dir = duk_require_string(J, 0);

    if (!dir) {
        return duk_generic_error(J, "No dirname");
    }

    int ret = mkdir(dir, 0);
    if (ret != 0) {
        return duk_generic_error(J, "Could not create directory: %s", strerror(errno));
    }
    return 0;
}

static duk_ret_t f_Rename(duk_context *J) {
    const char *from = duk_require_string(J, 0);
    const char *to = duk_require_string(J, 1);

    if (!from) {
        return duk_generic_error(J, "No source filename");
    }

    if (!to) {
        return duk_generic_error(J, "No destination filename");
    }

    int ret = rename(from, to);
    if (ret != 0) {
        return duk_generic_error(J, "Could not rename file: %s", strerror(errno));
    }
    return 0;
}

static duk_ret_t f_System(duk_context *J) {
    const char *cmd = duk_require_string(J, 0);

    int ret = system(cmd);

    duk_push_int(J, ret);
    return 1;
}

static duk_ret_t f_Sound(duk_context *J) {
    sound(duk_require_int(J, 0));
    return 0;
}

static duk_ret_t f_NoSound(duk_context *J) {
    nosound();
    return 0;
}

static duk_ret_t f_FreeSpace(duk_context *J) {
    int dr = duk_require_int(J, 0);
    struct dfree d;
    getdfree(dr, &d);

    duk_idx_t obj = duk_push_object(J);
    {
        duk_push_int(J, d.df_avail);
        duk_put_prop_string(J, obj, "availClusters");
        duk_push_int(J, d.df_total);
        duk_put_prop_string(J, obj, "totalClusters");
        duk_push_int(J, d.df_bsec);
        duk_put_prop_string(J, obj, "bytesPerSector");
        duk_push_int(J, d.df_sclus);
        duk_put_prop_string(J, obj, "bytesPerCluster");
    }
    return 1;
}

static duk_ret_t f_IsFixed(duk_context *J) {
    int dr = duk_require_int(J, 0);

    int type = _media_type(dr);

    switch (type) {
        case 1:
            duk_push_boolean(J, true);
            break;
        case 0:
            duk_push_boolean(J, false);
            break;
        default:
            return duk_generic_error(J, "Can't determine drive type.");
    }
    return 1;
}

static duk_ret_t f_IsCDROM(duk_context *J) {
    int dr = duk_require_int(J, 0);

    int type = _is_cdrom_drive(dr);

    switch (type) {
        case 1:
            duk_push_boolean(J, true);
            break;
        case 0:
            duk_push_boolean(J, false);
            break;
        default:
            return duk_generic_error(J, "Can't determine drive type.");
    }
    return 1;
}

static duk_ret_t f_IsFAT32(duk_context *J) {
    int dr = duk_require_int(J, 0);

    int type = _is_fat32(dr);

    switch (type) {
        case 1:
            duk_push_boolean(J, true);
            break;
        case 0:
            duk_push_boolean(J, false);
            break;
        default:
            return duk_generic_error(J, "Can't determine drive type.");
    }
    return 1;
}

static duk_ret_t f_IsRAMDisk(duk_context *J) {
    int dr = duk_require_int(J, 0);

    int type = _is_ram_drive(dr);

    switch (type) {
        case 1:
            duk_push_boolean(J, true);
            break;
        case 0:
            duk_push_boolean(J, false);
            break;
        default:
            return duk_generic_error(J, "Can't determine drive type.");
    }
    return 1;
}

static duk_ret_t f_GetFSType(duk_context *J) {
    int dr = duk_require_int(J, 0);

    char buffer[9];

    if (!_get_fs_type(dr, buffer)) {
        duk_push_string(J, buffer);
    } else {
        return duk_generic_error(J, "Can't determine fs type.");
    }
    return 1;
}

/***********************
** exported functions **
***********************/
/**
 * @brief initialize functions.
 *
 * @param J VM state.
 */
void init_funcs(duk_context *J, int argc, char *argv[], int idx) {
    // define some global properties
    duk_push_global_object(J);
    duk_put_global_string(J, "global");

    PROPDEF_N(J, JSH_VERSION, "JSH_VERSION");

    // push script args into an array and set it as global args variable
    duk_idx_t arr = duk_push_array(J);
    unsigned int i = 0;
    while (idx < argc) {
        duk_push_string(J, argv[idx++]);
        duk_put_prop_index(J, arr, i++);
    }
    duk_put_global_string(J, "args");

    // define global functions
    FUNCDEF(J, f_Print, "Print", DUK_VARARGS);
    FUNCDEF(J, f_Println, "Println", DUK_VARARGS);
    FUNCDEF(J, f_Debug, "Debug", DUK_VARARGS);
    FUNCDEF(J, f_Debugln, "Debugln", DUK_VARARGS);
    FUNCDEF(J, f_Quit, "Quit", 0);
    FUNCDEF(J, f_Gc, "Gc", 1);
    FUNCDEF(J, f_MemoryInfo, "MemoryInfo", 0);
    FUNCDEF(J, f_Sleep, "Sleep", 1);

    FUNCDEF(J, f_Read, "Read", 1);
    FUNCDEF(J, f_List, "List", 1);
    FUNCDEF(J, f_Stat, "Stat", 1);

    FUNCDEF(J, f_RmFile, "RmFile", 1);
    FUNCDEF(J, f_RmDir, "RmDir", 1);
    FUNCDEF(J, f_Rename, "Rename", 2);
    FUNCDEF(J, f_MakeDir, "MakeDir", 1);
    FUNCDEF(J, f_System, "System", 1);

    FUNCDEF(J, f_NoSound, "NoSound", 0);
    FUNCDEF(J, f_Sound, "Sound", 1);

    FUNCDEF(J, f_FreeSpace, "FreeSpace", 1);
    FUNCDEF(J, f_IsFixed, "IsFixed", 1);
    FUNCDEF(J, f_IsCDROM, "IsCDROM", 1);
    FUNCDEF(J, f_IsFAT32, "IsFAT32", 1);
    FUNCDEF(J, f_IsRAMDisk, "IsRAMDisk", 1);
    FUNCDEF(J, f_GetFSType, "GetFSType", 1);
}
