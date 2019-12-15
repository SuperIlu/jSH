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
#include <duktape.h>
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "file.h"
#include "jSH.h"

/************
** defines **
************/
#define MAX_LINE_LENGTH 4096  //!< read at max 4KiB

/************
** structs **
************/
//! file userdata definition
typedef struct __file {
    FILE *file;      //!< the file pointer
    bool writeable;  //!< indicates the file was opened for writing
} file_t;

/*********************
** static functions **
*********************/
/**
 * @brief finalize a file and free resources.
 *
 * @param J VM state.
 */
static duk_ret_t File_Finalize(duk_context *J) {
    duk_get_prop_string(J, -1, DUK_HIDDEN_SYMBOL(TAG_FILE));
    file_t *f = duk_get_pointer(J, -1);

    if (f->file) {
        fclose(f->file);
    }
    free(f);
    return 0;
}

/**
 * @brief open a file and store it as userdata in JS object.
 * new File(filename:string)
 *
 * @param J VM state.
 */
static duk_ret_t new_File(duk_context *J) {
    if (!duk_is_constructor_call(J)) {
        return DUK_RET_TYPE_ERROR;
    }

    const char *fname = duk_require_string(J, 0);

    file_t *f = malloc(sizeof(file_t));
    if (!f) {
        return duk_generic_error(J, "No memory for file '%s'", fname);
    }

    const char *mode = duk_require_string(J, 1);
    if (mode[0] == 'a' || mode[0] == 'w') {
        f->writeable = true;
    } else if (mode[0] == 'r') {
        f->writeable = false;
    } else {
        free(f);
        return duk_generic_error(J, "Unknown mode for file '%s'", mode);
    }

    f->file = fopen(fname, mode);
    if (!f->file) {
        free(f);
        return duk_generic_error(J, "cannot open file '%s': %s", fname, strerror(errno));
    }

    // Get access to the default instance.
    duk_push_this(J);  // -> stack: [ name this ]

    duk_push_pointer(J, f);
    duk_put_prop_string(J, -2, DUK_HIDDEN_SYMBOL(TAG_FILE));

    /* Set this.name to name. */
    duk_push_string(J, fname);
    duk_put_prop_string(J, -2, "name");

    duk_push_c_function(J, File_Finalize, 1);
    duk_set_finalizer(J, -2);

    /* Return undefined: default instance will be used. */
    return 0;
}

/**
 * @brief return the next byte from the file as number.
 * file.ReadByte():number
 *
 * @param J VM state.
 */
static duk_ret_t File_ReadByte(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (!f->file) {
        return duk_generic_error(J, "File was closed!");
    }

    if (f->writeable) {
        return duk_generic_error(J, "File was opened for writing!");
    } else {
        int ch = getc(f->file);
        if (ch != EOF) {
            duk_push_int(J, ch);
        } else {
            duk_push_null(J);
        }
    }
    return 1;
}

/**
 * @brief return the next line from the file as string.
 * file.ReadLine():string
 *
 * @param J VM state.
 */
static duk_ret_t File_ReadLine(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (!f->file) {
        return duk_generic_error(J, "File was closed!");
    }

    if (f->writeable) {
        return duk_generic_error(J, "File was opened for writing!");
    } else {
        char line[MAX_LINE_LENGTH + 1];
        char *s = fgets(line, sizeof(line), f->file);
        if (s) {
            duk_push_string(J, line);
        } else {
            duk_push_null(J);
        }
    }
    return 1;
}

/**
 * @brief close the file.
 * file.Close()
 *
 * @param J VM state.
 */
static duk_ret_t File_Close(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (f->file) {
        fclose(f->file);
        f->file = NULL;
    }
    return 0;
}

/**
 * @brief write a byte to a file.
 * file.WriteByte(ch:number)
 *
 * @param J VM state.
 */
static duk_ret_t File_WriteByte(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (!f->file) {
        return duk_generic_error(J, "File was closed!");
    }

    int ch = duk_require_int(J, 0);

    if (!f->writeable) {
        return duk_generic_error(J, "File was opened for reading!");
    } else {
        fputc((char)ch, f->file);
        fflush(f->file);
    }
    return 0;
}

/**
 * @brief write a string (terminated by a NEWLINE) to a file.
 * file.WriteLine(txt:string)
 *
 * @param J VM state.
 */
static duk_ret_t File_WriteLine(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (!f->file) {
        return duk_generic_error(J, "File was closed!");
    }

    const char *line = duk_require_string(J, 0);

    if (!f->writeable) {
        return duk_generic_error(J, "File was opened for reading!");
    } else {
        fputs(line, f->file);
        fputc('\n', f->file);
        fflush(f->file);
    }
    return 0;
}

/**
 * @brief write a string to a file.
 * file.WriteString(txt:string)
 *
 * @param J VM state.
 */
static duk_ret_t File_WriteString(duk_context *J) {
    file_t *f;
    NATIVE_PTR(J, f, TAG_FILE);

    if (!f->file) {
        return duk_generic_error(J, "File was closed!");
    }

    const char *line = duk_require_string(J, 0);

    if (!f->writeable) {
        return duk_generic_error(J, "File was opened for reading!");
    } else {
        fputs(line, f->file);
        fflush(f->file);
    }
    return 0;
}

/***********************
** exported functions **
***********************/
/**
 * @brief initialize file subsystem.
 *
 * @param J VM state.
 */
void init_file(duk_context *J) {
    // Push constructor function
    duk_push_c_function(J, new_File, 2);

    // Push MyObject.prototype object.
    duk_push_object(J);  // -> stack: [ MyObject proto ]

    // Set MyObject.prototype.funcs()
    PROTDEF(J, File_ReadByte, "ReadByte", 0);
    PROTDEF(J, File_ReadLine, "ReadLine", 0);
    PROTDEF(J, File_Close, "Close", 0);
    PROTDEF(J, File_WriteByte, "WriteByte", 1);
    PROTDEF(J, File_WriteLine, "WriteLine", 1);
    PROTDEF(J, File_WriteString, "WriteString", 1);

    /* Set MyObject.prototype = proto */
    duk_put_prop_string(J, -2, "prototype"); /* -> stack: [ MyObject ] */

    /* Finally, register MyObject to the global object */
    duk_put_global_string(J, "File"); /* -> stack: [ ] */
}
