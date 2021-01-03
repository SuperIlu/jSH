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

#include "lowlevel.h"
#include "watt.h"
#include "socket.h"
#include "zipfile.h"
#include "file.h"
#include "funcs.h"
#include "jSH.h"
#include "jsconio.h"

#define TICK_DELAY 10

typedef struct __shutdown_t {
    struct __shutdown_t *next;
    void (*function)(void);
} shutdown_t;

/**************
** Variables **
**************/
FILE *logfile;  //!< logfile for LOGF(), LOG(), DEBUG() DEBUGF() and Print()

const char *lastError;

shutdown_t *jsh_shutdown_chain = NULL;

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
 * @brief call all registered shutdown functions.
 */
static void jsh_run_shutdown_chain() {
    if (jsh_shutdown_chain) {
        shutdown_t *chain = jsh_shutdown_chain;
        DEBUGF("%p: Calling shutdown function %p\n", chain, chain->function);
        chain->function();
        while (chain->next) {
            chain = chain->next;
            DEBUGF("%p: Calling shutdown function %p\n", chain, chain->function);
            chain->function();
        }
    }
}

/**
 * @brief run the given script.
 *
 * @param script the script filename.
 * @param debug enable debug output.
 */
static void run_script(char *script, bool debug, int argc, char *argv[], int idx) {
    js_State *J;
    // create logfile
    logfile = fopen(LOGFILE, "a");
    setbuf(logfile, 0);

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

    PROPDEF_B(J, debug, "DEBUG");

    // load main file and run it
    lastError = NULL;
    js_dofile(J, script);
    LOG("jSH Shutdown...\n");

    jsh_run_shutdown_chain();
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
 * @brief register a function to be called when the js interpretation ends.
 *
 * @param function function to be called
 */
void jsh_register_shutdown(void (*function)(void)) {
    if (function) {
        DEBUGF("Registering shutdown function %p\n", function);
        shutdown_t *new_entry = calloc(1, sizeof(shutdown_t));
        if (new_entry) {
            // insert as first entry
            DEBUGF("Created %p\n", new_entry);
            new_entry->function = function;
            new_entry->next = jsh_shutdown_chain;
            jsh_shutdown_chain = new_entry;
        } else {
            LOGF("WARNING: Could not register shutdown hook for loaded library! Continuing nonetheless...");
        }
    }
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
