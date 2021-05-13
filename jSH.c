/*
MIT License

Copyright (c) 2019-2021 Andre Seidelt <superilu@yahoo.com>

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
#include <jsi.h>
#include <mujs.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <dlfcn.h>

#include "lowlevel.h"
#include "watt.h"
#include "socket.h"
#include "zipfile.h"
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

library_t *jsh_loaded_libraries = NULL;

/*********************
** static functions **
*********************/
/**
 * @brief show usage on console
 */
static void usage() {
    fputs("Usage: JSH.EXE <script> [parameter]\n", stderr);
    fputs("    -d             : Set global DEBUG variable to true.\n", stderr);
    fputs("    -n             : Disable JSLOG.TXT.\n", stderr);
    fputs("    -l <file>      : Redirect JSLOG.TXT to <file>.\n", stderr);
    fputs("\n", stderr);
    fputs("This is jSH " JSH_VERSION_STR "\n", stderr);
    fputs("(c) 2019-2021 by Andre Seidelt <superilu@yahoo.com> and others.\n", stderr);
    fputs("See LICENSE for detailed licensing information.\n", stderr);
    fputs("\n", stderr);
    exit(1);
}

/**
 * @brief write panic message.
 *
 * @param J VM state.
 */
static void Panic(js_State *J) { LOGF("!!! PANIC in %s !!!\n", J->filename); }

/**
 * @brief write 'report' message.
 *
 * @param J VM state.
 */
static void Report(js_State *J, const char *message) {
    lastError = message;
    LOGF("%s\n", message);
}

/**
 * @brief shutdown all registered libraries
 */
static void jsh_shutdown_libraries() {
    if (jsh_loaded_libraries) {
        library_t *chain = jsh_loaded_libraries;
        while (chain) {
            DEBUGF("%p: Library shutdown for %s. Shutdown function %p\n", chain, chain->name, chain->shutdown);

            // call shutdown if any
            if (chain->shutdown) {
                chain->shutdown();
            }
            // free mem for the name
            free((void *)chain->name);
            chain->name = NULL;
            // close the DXE
            dlclose(chain->handle);
            chain->handle = NULL;
            // remember current, advance to next and free current mem
            library_t *last = chain;
            chain = chain->next;
            free(last);
        }
    }
}

/**
 * @brief run the given script.
 *
 * @param script the script filename.
 * @param debug enable debug output.
 */
static void run_script(char *script, bool debug, int argc, char *argv[], int idx, char *logfile_name) {
    js_State *J;
    // create logfile
    if (logfile_name) {
        logfile = fopen(logfile_name, "a");
        if (!logfile) {
            fprintf(stderr, "Could not open/create logfile %s.\n", logfile_name);
            exit(1);
        }
        setbuf(logfile, 0);
    } else {
        logfile = NULL;
    }

    // create VM
    J = js_newstate(NULL, NULL, 0);
    js_atpanic(J, Panic);
    js_setreport(J, Report);

    // write startup message
    LOG("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
    LOGF("jSH %s starting with file %s\n", JSH_VERSION_STR, script);

    // detect hardware and initialize subsystems
    init_funcs(J, argc, argv, idx);
    init_file(J);
    init_conio(J);
    init_lowlevel(J);
    init_watt(J);
    init_socket(J);
    init_zipfile(J);

    // do some more init from JS
    js_dofile(J, JSINC_FUNC);
    js_dofile(J, JSINC_FILE);

    // overwrites DEBUG property from func.js
    PROPDEF_B(J, debug, "DEBUG");

    // load main file and run it
    lastError = NULL;
    js_dofile(J, script);
    LOG("jSH Shutdown...\n");
    js_freestate(J);
    jsh_shutdown_libraries();
    if (logfile) {
        fclose(logfile);
    }

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
 * @brief register a library.
 *
 * @param name pointer to a name. This function will make a copy of the string.
 * @param handle the handle returned by dlopen().
 * @param shutdown function to be called for shutdown or NULL.
 *
 * @return true if registration succeeded, else false.
 */
bool jsh_register_library(const char *name, void *handle, void (*shutdown)(void)) {
    DEBUGF("Registering library %s. Shutdown function %p\n", shutdown);

    // get new entry
    library_t *new_entry = calloc(1, sizeof(library_t));
    if (!new_entry) {
        LOGF("WARNING: Could not register shutdown hook for loaded library %s!", name);
        return false;
    }

    // copy name
    char *name_copy = malloc(strlen(name) + 1);
    if (!name_copy) {
        LOGF("WARNING: Could not register shutdown hook for loaded library %s!", name);
        free(new_entry);
        return false;
    }
    strcpy(name_copy, name);

    // store values
    DEBUGF("Created %p\n", new_entry);
    new_entry->name = name_copy;
    new_entry->handle = handle;
    new_entry->shutdown = shutdown;

    // insert at start of list
    new_entry->next = jsh_loaded_libraries;
    jsh_loaded_libraries = new_entry;
    return true;
}

/**
 * @brief check if a given library is already registered.
 *
 * @param name name to search for.
 * @return true if the librari is already in the list, else false.
 */
bool jsh_check_library(const char *name) {
    if (jsh_loaded_libraries) {
        library_t *chain = jsh_loaded_libraries;
        while (chain) {
            if (strcmp(name, chain->name) == 0) {
                return true;
            }

            chain = chain->next;
        }
    }
    return false;
}

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
    bool do_logfile = true;
    char *logfile_name = LOGFILE;
    int opt;

    // check parameters
    while ((opt = getopt(argc, argv, "dnl:")) != -1) {
        switch (opt) {
            case 'd':
                debug = true;
                break;
            case 'n':
                do_logfile = false;
                break;
            case 'l':
                logfile_name = optarg;
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

    // 'n' takes preceedence over redirection
    if (!do_logfile) {
        logfile_name = NULL;
    }

    run_script(script, debug, argc, argv, optind, logfile_name);

    exit(0);
}
