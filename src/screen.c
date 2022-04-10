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

#include <errno.h>
#include <mujs.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <pc.h>

#include "jSH.h"
#include "screen.h"

/************
** structs **
************/
//! screen definition
typedef struct __screen {
    uint16_t *data;        //!< the screen data
    uint16_t len;          //!< max index of the data array
    uint8_t width;         //!< screen width
    uint8_t height;        //!< screen height
    uint8_t ScreenAttrib;  //!< currently set attributes
} screen_t;

/*********************
** static functions **
*********************/
/**
 * @brief finalize a screen and free resources.
 *
 * @param J VM state.
 */
static void Screen_Finalize(js_State *J, void *data) {
    screen_t *s = (screen_t *)data;
    if (s->data) {
        free(s->data);
        s->data = NULL;
    }
    free(s);
}

/**
 * @brief create a screen.
 *
 * @param J VM state.
 */
static void new_Screen(js_State *J) {
    NEW_OBJECT_PREP(J);

    screen_t *s = calloc(sizeof(screen_t), 1);
    if (!s) {
        JS_ENOMEM(J);
        return;
    }

    s->width = ScreenCols();
    s->height = ScreenRows();
    s->ScreenAttrib = 0x07;
    s->len = ScreenRows() * ScreenCols();

    s->data = calloc(s->len, 2);
    if (!s->data) {
        JS_ENOMEM(J);
        free(s);
        return;
    }

    js_currentfunction(J);
    js_getproperty(J, -1, "prototype");
    js_newuserdata(J, TAG_SCREEN, s, Screen_Finalize);

    // add properties
    js_pushnumber(J, s->width);
    js_defproperty(J, -2, "Width", JS_READONLY | JS_DONTENUM | JS_DONTCONF);

    js_pushnumber(J, s->height);
    js_defproperty(J, -2, "Height", JS_READONLY | JS_DONTENUM | JS_DONTCONF);
}

/**
 * @brief copy current display data to screen.
 *
 * @param J VM state.
 */
static void Screen_FromDisplay(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    ScreenRetrieve(s->data);
}

/**
 * @brief copy screen to display.
 *
 * @param J VM state.
 */
static void Screen_ToDisplay(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    ScreenUpdate(s->data);
}

static void Screen_TextColor(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    int color = js_toint16(J, 1);
    s->ScreenAttrib = (s->ScreenAttrib & 0xF0) | (color & 0xF);
}

static void Screen_TextBackground(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    int color = js_touint16(J, 1);
    s->ScreenAttrib = (s->ScreenAttrib & 0x0F) | ((color & 0xF) << 4);
}

static void Screen_Clear(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    int pos = 0;
    uint16_t _attr = (s->ScreenAttrib << 8) & 0xFF00;
    while (pos < s->len) {
        s->data[pos] = ' ' | _attr;
        pos++;
    }
}

static void Screen_Put(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    int x = js_touint16(J, 1);
    int y = js_touint16(J, 2);

    if (x == 0 || y == 0) {
        js_error(J, "Coordinates are 1-based");
        return;
    }

    x--;
    y--;

    const char *str = js_tostring(J, 3);
    uint16_t _attr = (s->ScreenAttrib << 8) & 0xFF00;
    int pos = x + s->width * y;
    while (pos < s->len && *str) {
        s->data[pos] = *str | _attr;
        pos++;
        str++;
    }
}

static void Screen_Put0(js_State *J) {
    screen_t *s = js_touserdata(J, 0, TAG_SCREEN);
    if (!s->data) {
        js_error(J, "Screen was closed!");
        return;
    }

    int x = js_touint16(J, 1);
    int y = js_touint16(J, 2);

    const char *str = js_tostring(J, 3);
    uint16_t _attr = (s->ScreenAttrib << 8) & 0xFF00;
    int pos = x + s->width * y;
    while (pos < s->len && *str) {
        s->data[pos] = *str | _attr;
        pos++;
        str++;
    }
}

/***********************
** exported functions **
***********************/
/**
 * @brief initialize file subsystem.
 *
 * @param J VM state.
 */
void init_screen(js_State *J) {
    DEBUGF("%s\n", __PRETTY_FUNCTION__);

    js_newobject(J);
    {
        NPROTDEF(J, Screen, FromDisplay, 0);
        NPROTDEF(J, Screen, ToDisplay, 0);
        NPROTDEF(J, Screen, Clear, 0);
        NPROTDEF(J, Screen, TextBackground, 1);
        NPROTDEF(J, Screen, TextColor, 1);
        NPROTDEF(J, Screen, Put, 3);
        NPROTDEF(J, Screen, Put0, 3);
    }
    CTORDEF(J, new_Screen, TAG_SCREEN, 0);

    DEBUGF("%s DONE\n", __PRETTY_FUNCTION__);
}
