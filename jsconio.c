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
#include <pc.h>

#include "jsconio.h"

static duk_ret_t f_SetCursorType(duk_context *J) {
    int ct = duk_require_int(J, 0);
    if (ct != _NOCURSOR && ct != _SOLIDCURSOR && ct != _NORMALCURSOR) {
        return duk_generic_error(J, "Invalid cursor type");
    }
    _setcursortype(ct);
    return 0;
}

static duk_ret_t f_GotoXY(duk_context *J) {
    gotoxy(duk_require_int(J, 0), duk_require_int(J, 1));
    return 0;
}

static duk_ret_t f_LowVideo(duk_context *J) {
    lowvideo();
    return 0;
}
static duk_ret_t f_HighVideo(duk_context *J) {
    highvideo();
    return 0;
}

static duk_ret_t f_ScreenVisualBell(duk_context *J) {
    ScreenVisualBell();
    return 0;
}

static duk_ret_t f_ScreenCols(duk_context *J) {
    duk_push_int(J, ScreenCols());
    return 1;
}
static duk_ret_t f_ScreenRows(duk_context *J) {
    duk_push_int(J, ScreenRows());
    return 1;
}

static duk_ret_t f_WhereX(duk_context *J) {
    duk_push_int(J, wherex());
    return 1;
}
static duk_ret_t f_WhereY(duk_context *J) {
    duk_push_int(J, wherey());
    return 1;
}

static duk_ret_t f_TextMode(duk_context *J) {
    int tm = duk_require_int(J, 0);
    if (tm != LASTMODE && tm != BW40 && tm != C40 && tm != BW80 && tm != C80 && tm != C4350 && tm != MONO) {
        return duk_generic_error(J, "Invalid text mode");
    }
    textmode(tm);
    return 0;
}

static duk_ret_t f_TextColor(duk_context *J) {
    int c = duk_require_int(J, 0);
    textcolor(c);
    return 0;
}
static duk_ret_t f_TextBackground(duk_context *J) {
    int c = duk_require_int(J, 0);
    textbackground(c);
    return 0;
}

static duk_ret_t f_ClearEol(duk_context *J) {
    clreol();
    return 0;
}
static duk_ret_t f_ClearScreen(duk_context *J) {
    clrscr();
    return 0;
}
static duk_ret_t f_DeleteLine(duk_context *J) {
    delline();
    return 0;
}
static duk_ret_t f_InsertLine(duk_context *J) {
    insline();
    return 0;
}

static duk_ret_t f_CGets(duk_context *J) {
    char buff[260];
    buff[0] = 255;
    char *str = cgets(buff);
    str[(unsigned int)buff[1]] = 0;
    duk_push_string(J, str);
    return 1;
}

static duk_ret_t f_CPuts(duk_context *J) {
    cputs(duk_require_string(J, 0));
    return 0;
}

static duk_ret_t f_GetCh(duk_context *J) {
    char buff[2];
    buff[0] = getch();
    buff[1] = 0;

    duk_push_string(J, buff);
    return 1;
}

static duk_ret_t f_GetChE(duk_context *J) {
    char buff[2];
    buff[0] = getche();
    buff[1] = 0;

    duk_push_string(J, buff);
    return 1;
}

static duk_ret_t f_UngetCh(duk_context *J) {
    const char *ch = duk_require_string(J, 0);
    ungetch(ch[0]);
    return 0;
}

static duk_ret_t f_PutCh(duk_context *J) {
    const char *ch = duk_require_string(J, 0);
    putch(ch[0]);
    return 0;
}

static duk_ret_t f_AsciiCharDef(duk_context *J) {
    char buff[2];
    buff[0] = duk_require_int(J, 0);
    buff[1] = 0;
    duk_push_string(J, buff);
    return 1;
}

static duk_ret_t f_EnableScrolling(duk_context *J) {
    _wscroll = duk_require_boolean(J, 0);
    return 0;
}

static duk_ret_t f_GetXKey(duk_context *J) {
    duk_push_int(J, getxkey());
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
void init_conio(duk_context *J) {
    // colors
    PROPDEF_N(J, BLACK, "BLACK");
    PROPDEF_N(J, BLUE, "BLUE");
    PROPDEF_N(J, GREEN, "GREEN");
    PROPDEF_N(J, CYAN, "CYAN");
    PROPDEF_N(J, RED, "RED");
    PROPDEF_N(J, MAGENTA, "MAGENTA");
    PROPDEF_N(J, BROWN, "BROWN");
    PROPDEF_N(J, LIGHTGRAY, "LIGHTGRAY");
    PROPDEF_N(J, DARKGRAY, "DARKGRAY");
    PROPDEF_N(J, LIGHTBLUE, "LIGHTBLUE");
    PROPDEF_N(J, LIGHTGREEN, "LIGHTGREEN");
    PROPDEF_N(J, LIGHTCYAN, "LIGHTCYAN");
    PROPDEF_N(J, LIGHTRED, "LIGHTRED");
    PROPDEF_N(J, LIGHTMAGENTA, "LIGHTMAGENTA");
    PROPDEF_N(J, YELLOW, "YELLOW");
    PROPDEF_N(J, WHITE, "WHITE");

    // cursor types
    PROPDEF_N(J, _NOCURSOR, "NOCURSOR");
    PROPDEF_N(J, _SOLIDCURSOR, "SOLIDCURSOR");
    PROPDEF_N(J, _NORMALCURSOR, "NORMALCURSOR");

    // text modes
    PROPDEF_N(J, LASTMODE, "LASTMODE");
    PROPDEF_N(J, BW40, "BW40");
    PROPDEF_N(J, C40, "C40");
    PROPDEF_N(J, BW80, "BW80");
    PROPDEF_N(J, C80, "C80");
    PROPDEF_N(J, MONO, "MONO");
    PROPDEF_N(J, C4350, "C4350");

    // define global functions
    FUNCDEF(J, f_TextColor, "TextColor", 1);
    FUNCDEF(J, f_TextBackground, "TextBackground", 1);

    FUNCDEF(J, f_LowVideo, "LowVideo", 0);
    FUNCDEF(J, f_HighVideo, "HighVideo", 0);

    FUNCDEF(J, f_ClearEol, "ClearEol", 0);
    FUNCDEF(J, f_ClearScreen, "ClearScreen", 0);
    FUNCDEF(J, f_DeleteLine, "DeleteLine", 0);
    FUNCDEF(J, f_InsertLine, "InsertLine", 0);

    FUNCDEF(J, f_CGets, "CGets", 0);
    FUNCDEF(J, f_CPuts, "CPuts", 1);

    FUNCDEF(J, f_GetCh, "GetCh", 1);
    FUNCDEF(J, f_GetChE, "GetChE", 1);
    FUNCDEF(J, f_UngetCh, "UngetCh", 1);
    FUNCDEF(J, f_PutCh, "PutCh", 1);

    FUNCDEF(J, f_SetCursorType, "SetCursorType", 1);
    FUNCDEF(J, f_TextMode, "TextMode", 1);

    FUNCDEF(J, f_GotoXY, "GotoXY", 2);
    FUNCDEF(J, f_WhereX, "WhereX", 0);
    FUNCDEF(J, f_WhereY, "WhereY", 0);

    FUNCDEF(J, f_ScreenRows, "ScreenRows", 0);
    FUNCDEF(J, f_ScreenCols, "ScreenCols", 0);
    FUNCDEF(J, f_ScreenVisualBell, "ScreenVisualBell", 0);

    FUNCDEF(J, f_AsciiCharDef, "AsciiCharDef", 1);
    FUNCDEF(J, f_EnableScrolling, "EnableScrolling", 1);
    FUNCDEF(J, f_GetXKey, "GetXKey", 0);
}

/*

blinkvideo
_conio_gettext
_conio_kbhit
delline
gettext
gettextinfo
gppconio_init
insline
intensevideo
movetext
normvideo
puttext
Screen Variables
ScreenClear
ScreenGetChar
ScreenGetCursor
ScreenMode
ScreenPutChar
ScreenPutString
ScreenRetrieve
ScreenSetCursor
ScreenUpdate
ScreenUpdateLine
_set_screen_lines
textattr
ungetch
window

*/
