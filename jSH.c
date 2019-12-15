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

#include <conio.h>
#include <duktape.h>
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include "file.h"
#include "funcs.h"
#include "jSH.h"
#include "jsconio.h"

#define TICK_DELAY 10

/**************
** Variables **
**************/
FILE *logfile;  //!< logfile for LOGF(), LOG(), DEBUG() DEBUGF() and Print()

const char *lastError;

/*********************
** static functions **
*********************/
/**
 * @brief show usage on console
 */
static void usage() {
    fputs("Usage: JSH.EXE <script> [parameter]\n", stderr);
    fputs("\n", stderr);
    fputs("This is jSH " JSH_VERSION_STR "\n", stderr);
    fputs("(c) 2019 by Andre Seidelt <superilu@yahoo.com> and others.\n", stderr);
    fputs("See LICENSE for detailed licensing information.\n", stderr);
    fputs("\n", stderr);
    exit(1);
}

/**
 * @brief write panic message.
 *
 * @param udata user data.
 * @param msg error message.
 */
static void cmdline_fatal_handler(void *udata, const char *msg) {
    (void)udata;
    LOGF("*** FATAL ERROR: %s\n", msg ? msg : "no message");
    exit(1);
}

#ifdef FOOBAR
/**
 * @brief write 'report' message.
 *
 * @param J VM state.
 */
static void print_pop_error(duk_context *J) {
    LOGF("%s\n", duk_safe_to_stacktrace(J, -1));
    duk_pop(J);
}

/**
 * @brief call a globally define JS function.
 *
 * @param J VM state.
 * @param name function name.
 *
 * @return true if the function was found.
 * @return false if the function was not found.
 */
static bool callGlobal(duk_context *J, const char *name) {
    if (duk_get_global_string(J, name)) {
        if (duk_pcall(J, 0) == DUK_EXEC_ERROR) {
            LOGF("Error calling %s: %s\n", name, duk_safe_to_string(J, -1));
        }
        duk_pop(J);
        return true;
    } else {
        return false;
    }
}
#endif

static bool doFile(duk_context *J, const char *fname) {
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

    s = malloc(n);
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
    fclose(f);

    bool ret = true;
    duk_push_string(J, fname);
    if (duk_pcompile_lstring_filename(J, 0, s, n) != 0) {
        LOGF("compile failed: %s\n", duk_safe_to_string(J, -1));
    } else {
        if (duk_pcall(J, 0) != DUK_EXEC_SUCCESS) {
            if (duk_is_error(J, -1)) {
                /* Accessing .stack might cause an error to be thrown, so wrap this
                 * access in a duk_safe_call() if it matters.
                 */
                duk_get_prop_string(J, -1, "stack");
                lastError = duk_safe_to_string(J, -1);
                LOGF("error: %s\n", lastError);
                duk_pop(J);
            } else {
                /* Non-Error value, coerce safely to string. */
                lastError = duk_safe_to_string(J, -1);
                LOGF("error: %s\n", lastError);
            }
            ret = false;
        } else {
            LOGF("program result: %s\n", duk_safe_to_string(J, -1));
        }
    }
    duk_pop(J);
    free(s);

    return ret;
}

/**
 * @brief run the given script.
 *
 * @param script the script filename.
 * @param debug enable debug output.
 */
static void run_script(char *script, bool debug, int argc, char *argv[], int idx) {
    duk_context *J;
    // create logfile
    logfile = fopen(LOGFILE, "a");
    setbuf(logfile, 0);

    // create VM
    J = duk_create_heap(NULL, NULL, NULL, NULL, cmdline_fatal_handler);

    // write startup message
    LOG("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
    LOGF("jSH %s starting with file %s\n", JSH_VERSION_STR, script);

    // detect hardware and initialize subsystems
    init_funcs(J, argc, argv, idx);
    init_file(J);
    init_conio(J);

    lastError = NULL;
    // do some more init from JS
    if (doFile(J, JSINC_FUNC)) {
        if (doFile(J, JSINC_FILE)) {
            PROPDEF_B(J, debug, "DEBUG");  // overwrites DEBUG property from 'func.js'
            doFile(J, script);             // load main file and run it
        }
    }
    LOG("jSH Shutdown...\n");
    fclose(logfile);

    if (lastError) {
        fputs(lastError, stdout);
        fputs("\njSH ERROR\n", stdout);
    } else {
        fputs("jSH OK\n", stdout);
    }
    fflush(stdout);
}

/***********************
** exported functions **
***********************/
/**
 * @brief main entry point.
 *
 * @param argc command line parameters.
 * @param argv number of parameters.
 *
 * @return int exit code.
 */
int main(int argc, char **argv) {
    char *script = NULL;
    bool debug = false;
    int opt;

    // check parameters
    while ((opt = getopt(argc, argv, "d")) != -1) {
        switch (opt) {
            case 'd':
                debug = true;
                break;
            default: /* '?' */
                usage();
                exit(EXIT_FAILURE);
        }
    }

    if (optind >= argc) {
        fprintf(stderr, "Script name missing.\n");
        usage();
        exit(EXIT_FAILURE);
    } else {
        script = argv[optind];
    }
    optind++;

    run_script(script, debug, argc, argv, optind);

    exit(0);
}
