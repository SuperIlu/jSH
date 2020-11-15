/*
MIT License

Copyright (c) 2019-2020 Andre Seidelt <superilu@yahoo.com>

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

static void f_SetCursorType(js_State *J) {
    int ct = js_toint16(J, 1);
    if (ct != _NOCURSOR && ct != _SOLIDCURSOR && ct != _NORMALCURSOR) {
        js_error(J, "Invalid cursor type");
    }
    _setcursortype(ct);
}

static void f_GotoXY(js_State *J) {
    // if (js_isnumber(J, 1) || js_isnumber(J, 2)) {
    //     js_error(J, "Two numbers expected");
    // }

    gotoxy(js_toint16(J, 1), js_toint16(J, 2));
}

static void f_LowVideo(js_State *J) { lowvideo(); }
static void f_HighVideo(js_State *J) { highvideo(); }

static void f_ScreenVisualBell(js_State *J) { ScreenVisualBell(); }

static void f_ScreenCols(js_State *J) { js_pushnumber(J, ScreenCols()); }
static void f_ScreenRows(js_State *J) { js_pushnumber(J, ScreenRows()); }

static void f_WhereX(js_State *J) { js_pushnumber(J, wherex()); }
static void f_WhereY(js_State *J) { js_pushnumber(J, wherey()); }

static void f_TextMode(js_State *J) {
    int tm = js_toint16(J, 1);
    if (tm != LASTMODE && tm != BW40 && tm != C40 && tm != BW80 && tm != C80 && tm != C4350 && tm != MONO) {
        js_error(J, "Invalid text mode");
    }
    textmode(tm);
}

static void f_TextColor(js_State *J) {
    int c = js_toint16(J, 1);
    textcolor(c);
}
static void f_TextBackground(js_State *J) {
    int c = js_toint16(J, 1);
    textbackground(c);
}

static void f_ClearEol(js_State *J) { clreol(); }
static void f_ClearScreen(js_State *J) { clrscr(); }
static void f_DeleteLine(js_State *J) { delline(); }
static void f_InsertLine(js_State *J) { insline(); }

static void f_CGets(js_State *J) {
    char buff[260];
    buff[0] = 255;
    char *str = cgets(buff);
    str[(unsigned int)buff[1]] = 0;
    js_pushstring(J, str);
}

static void f_CPuts(js_State *J) { cputs(js_tostring(J, 1)); }

static void f_GetCh(js_State *J) {
    char buff[2];
    buff[0] = getch();
    buff[1] = 0;

    js_pushstring(J, buff);
}

static void f_GetChE(js_State *J) {
    char buff[2];
    buff[0] = getche();
    buff[1] = 0;

    js_pushstring(J, buff);
}

static void f_UngetCh(js_State *J) {
    const char *ch = js_tostring(J, 1);
    ungetch(ch[0]);
}

static void f_PutCh(js_State *J) {
    const char *ch = js_tostring(J, 1);
    putch(ch[0]);
}

static void f_AsciiCharDef(js_State *J) {
    char buff[2];
    buff[0] = js_toint16(J, 1);
    buff[1] = 0;
    js_pushstring(J, buff);
}

static void f_EnableScrolling(js_State *J) { _wscroll = js_toboolean(J, 1); }

static void f_GetXKey(js_State *J) { js_pushnumber(J, getxkey()); }

/***********************
** exported functions **
***********************/
/**
 * @brief initialize functions.
 *
 * @param J VM state.
 */
void init_conio(js_State *J) {
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
    NFUNCDEF(J, TextColor, 1);
    NFUNCDEF(J, TextBackground, 1);

    NFUNCDEF(J, LowVideo, 0);
    NFUNCDEF(J, HighVideo, 0);

    NFUNCDEF(J, ClearEol, 0);
    NFUNCDEF(J, ClearScreen, 0);
    NFUNCDEF(J, DeleteLine, 0);
    NFUNCDEF(J, InsertLine, 0);

    NFUNCDEF(J, CGets, 0);
    NFUNCDEF(J, CPuts, 1);

    NFUNCDEF(J, GetCh, 1);
    NFUNCDEF(J, GetChE, 1);
    NFUNCDEF(J, UngetCh, 1);
    NFUNCDEF(J, PutCh, 1);

    NFUNCDEF(J, SetCursorType, 1);
    NFUNCDEF(J, TextMode, 1);

    NFUNCDEF(J, GotoXY, 2);
    NFUNCDEF(J, WhereX, 0);
    NFUNCDEF(J, WhereY, 0);

    NFUNCDEF(J, ScreenRows, 0);
    NFUNCDEF(J, ScreenCols, 0);
    NFUNCDEF(J, ScreenVisualBell, 0);

    NFUNCDEF(J, AsciiCharDef, 1);
    NFUNCDEF(J, EnableScrolling, 1);
    NFUNCDEF(J, GetXKey, 0);
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
