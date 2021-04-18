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

#ifndef __JSH_H__
#define __JSH_H__

#include <mujs.h>
#include <stdbool.h>
#include <stdio.h>

/************
** defines **
************/

#define SYSINFO ">>> "  //!< logfile line prefix for system messages

#define JSH_VERSION 0.6         //!< version number
#define JSH_VERSION_STR "V0.6"  //!< version number as string

#define JSBOOT_DIR "JSBOOT/"  //!< directory with boot files.

#define LOGFILE "JSLOG.TXT"  //!< filename for logfile
#define LOGSTREAM logfile    //!< output stream for logging on DOS

#define JS_ENOMEM(j) js_error(j, "Out of memory")   //!< use always the same message when memory runs out
#define JS_ENOARR(j) js_error(j, "Array expected")  //!< use always the same message when array expected

/***********
** macros **
***********/
//! define a new constructor
#define CTORDEF(j, f, t, p)                \
    {                                      \
        js_newcconstructor(J, f, f, t, p); \
        js_defglobal(J, t, JS_DONTENUM);   \
    }

//! define a global function (new version)
#define NFUNCDEF(j, n, p)                 \
    {                                     \
        js_newcfunction(j, f_##n, #n, p); \
        js_setglobal(j, #n);              \
    }

//! define a method in a class (new version)
#define NPROTDEF(j, t, n, p)                                                \
    {                                                                       \
        js_newcfunction(j, t##_##n, #t ".prototype." #n, p);                \
        js_defproperty(j, -2, #n, JS_READONLY | JS_DONTENUM | JS_DONTCONF); \
    }

//! define a global property of type number
#define PROPDEF_N(j, i, n)  \
    {                       \
        js_newnumber(j, i); \
        js_setglobal(j, n); \
    }

//! define a global property of type boolean
#define PROPDEF_B(j, i, n)   \
    {                        \
        js_newboolean(j, i); \
        js_setglobal(j, n);  \
    }

//! printf-style write info to logfile/console
#define LOGF(str, ...)                                  \
    {                                                   \
        fprintf(LOGSTREAM, SYSINFO str, ##__VA_ARGS__); \
        fflush(LOGSTREAM);                              \
    }

//! write info to logfile/console
#define LOG(str)                       \
    {                                  \
        fputs(SYSINFO str, LOGSTREAM); \
        fflush(LOGSTREAM);             \
    }

//! write info to logfile/console
#define LOGV(str)                  \
    {                              \
        fputs(SYSINFO, LOGSTREAM); \
        fputs(str, LOGSTREAM);     \
        fflush(LOGSTREAM);         \
    }

#ifdef DEBUG_ENABLED
//! printf-style debug message to logfile/console
#define DEBUGF(str, ...)                                   \
    {                                                      \
        fprintf(LOGSTREAM, "[DEBUG] " str, ##__VA_ARGS__); \
        fflush(LOGSTREAM);                                 \
    }

//! print debug message to logfile/console
#define DEBUG(str)                        \
    {                                     \
        fputs("[DEBUG] " str, LOGSTREAM); \
        fflush(LOGSTREAM);                \
    }
#else
#define DEBUGF(str, ...)
#define DEBUG(str)
#endif

#ifdef GC_BEFORE_MALLOC
#define NEW_OBJECT_PREP(j) js_gc(j, false)
#else
#define NEW_OBJECT_PREP(j)
#endif

/*****************
** struct/types **
*****************/
typedef struct __library_t {
    struct __library_t *next;
    const char *name;
    void *handle;
    void (*shutdown)(void);
} library_t;

/*********************
** global variables **
*********************/
extern FILE *logfile;  //!< file for log output.
extern library_t *jsh_loaded_libraries;

/***********************
** exported functions **
***********************/
extern bool jsh_register_library(const char *name, void *handle, void (*shutdown)(void));
extern bool jsh_check_library(const char *name);

#endif  // __JSH_H__
