/* PCTIMER 1.4
   Millisecond Resolution Timing Library for DJGPP V2
   Release Date: 3/15/1998
   Chih-Hao Tsai (hao520@yahoo.com)
 */

#include <dos.h>
#include <dpmi.h>
#include <pc.h>
#include <go32.h>
#include <bios.h>
#include <string.h>
#include "gccint8.h"

#define IRQ0 0x8
#define PIT0 0x40
#define PIT1 0x41
#define PIT2 0x42
#define PITMODE 0x43
#define PITCONST 1193180L
#define PIT0DEF 18.2067597
#define KBCTRL 0x61
#define NEW8H 1
#define TRUE_FAILURE 0
#define CHAIN_TERMINATION 1
#define OUTPORTB_TERMINATION 2

static float tick_per_ms = 0.0182068;
static float ms_per_tick = 54.9246551;
static float freq8h = 18.2067597;
static unsigned char flag8h = 0;
static _go32_dpmi_seginfo rm_old_handler, rm_new_handler, pm_old_handler, pm_new_handler;
static _go32_dpmi_registers r, r1;
int counter_8h;
int counter_reset;
unsigned long int ticks_8h = 0;
unsigned char flag_pm_termination = TRUE_FAILURE;

static void (*hook_function)();

void pctimer_init(unsigned int Hz) {
    unsigned int pit0_set, pit0_value;

    if (flag8h != NEW8H) {
        disable();

        lock_rm_new8h();
        lock_pm_new8h();

        _go32_dpmi_lock_data(&hook_function, sizeof(hook_function));
        _go32_dpmi_lock_data(&ticks_8h, sizeof(ticks_8h));
        _go32_dpmi_lock_data(&counter_8h, sizeof(counter_8h));
        _go32_dpmi_lock_data(&counter_8h, sizeof(counter_reset));
        _go32_dpmi_lock_data(&flag_pm_termination, sizeof(flag_pm_termination));
        _go32_dpmi_lock_data(&r, sizeof(r));
        _go32_dpmi_lock_data(&r1, sizeof(r1));

        _go32_dpmi_get_protected_mode_interrupt_vector(8, &pm_old_handler);
        pm_new_handler.pm_offset = (int)pm_new8h;
        pm_new_handler.pm_selector = _go32_my_cs();
        _go32_dpmi_chain_protected_mode_interrupt_vector(8, &pm_new_handler);

        _go32_dpmi_get_real_mode_interrupt_vector(8, &rm_old_handler);
        rm_new_handler.pm_offset = (int)rm_new8h;
        _go32_dpmi_allocate_real_mode_callback_iret(&rm_new_handler, &r1);
        _go32_dpmi_set_real_mode_interrupt_vector(8, &rm_new_handler);

        outportb(PITMODE, 0x36);
        pit0_value = PITCONST / Hz;
        pit0_set = (pit0_value & 0x00ff);
        outportb(PIT0, pit0_set);
        pit0_set = (pit0_value >> 8);
        outportb(PIT0, pit0_set);

        ticks_8h = 0;
        flag8h = NEW8H;
        freq8h = Hz;
        counter_8h = 0;
        counter_reset = freq8h / PIT0DEF;
        tick_per_ms = freq8h / 1000;
        ms_per_tick = 1000 / freq8h;

        enable();
    }
}

void pctimer_exit(void) {
    // unsigned int pit0_set, pit0_value;
    unsigned long tick;
    char *cmostime;

    if (flag8h == NEW8H) {
        disable();

        outportb(PITMODE, 0x36);
        outportb(PIT0, 0x00);
        outportb(PIT0, 0x00);

        _go32_dpmi_set_protected_mode_interrupt_vector(8, &pm_old_handler);

        _go32_dpmi_set_real_mode_interrupt_vector(8, &rm_old_handler);
        _go32_dpmi_free_real_mode_callback(&rm_new_handler);

        enable();

        cmostime = get_cmostime();
        tick = PIT0DEF * ((((float)*cmostime) * 3600) + (((float)*(cmostime + 1)) * 60) + (((float)*(cmostime + 2))));
        biostime(1, tick);

        flag8h = 0;
        freq8h = PIT0DEF;
        counter_reset = freq8h / PIT0DEF;
        tick_per_ms = freq8h / 1000;
        ms_per_tick = 1000 / freq8h;
    }
}

void rm_new8h(void) {
    disable();

    if (flag_pm_termination == TRUE_FAILURE) {
        ticks_8h++;
        counter_8h++;
    }

    if ((counter_8h == counter_reset) || (flag_pm_termination == CHAIN_TERMINATION)) {
        flag_pm_termination = TRUE_FAILURE;
        counter_8h = 0;
        memset(&r, 0, sizeof(r));
        r.x.cs = rm_old_handler.rm_segment;
        r.x.ip = rm_old_handler.rm_offset;
        r.x.ss = r.x.sp = 0;
        _go32_dpmi_simulate_fcall_iret(&r);
        enable();
    } else {
        flag_pm_termination = TRUE_FAILURE;
        outportb(0x20, 0x20);
        enable();
    }
}

void lock_rm_new8h(void) { _go32_dpmi_lock_code(rm_new8h, (unsigned long)(lock_rm_new8h - rm_new8h)); }

void pm_new8h(void) {
    disable();

    ticks_8h++;
    counter_8h++;

    flag_pm_termination = TRUE_FAILURE;

    if (hook_function) {
        hook_function();
    }

    if (counter_8h == counter_reset) {
        flag_pm_termination = CHAIN_TERMINATION;
        counter_8h = 0;
        enable();
    } else {
        flag_pm_termination = OUTPORTB_TERMINATION;
        outportb(0x20, 0x20);
        enable();
    }
}

void lock_pm_new8h(void) { _go32_dpmi_lock_code(pm_new8h, (unsigned long)(lock_pm_new8h - pm_new8h)); }

unsigned long pctimer_get_ticks(void) { return ticks_8h; }

unsigned long pctimer_time(unsigned long start, unsigned long finish) {
    unsigned long duration, millisec;

    if (finish < start)
        return 0;
    else {
        duration = finish - start;
        millisec = duration * ms_per_tick;
        return millisec;
    }
}

void pctimer_sleep(unsigned int delayms) {
    unsigned long int delaybegin = 0;
    unsigned long int delayend = 0;
    unsigned int delaytick;

    delaytick = delayms * tick_per_ms;

    if (flag8h == NEW8H)
        delaybegin = pctimer_get_ticks();
    else
        delaybegin = biostime(0, 0);

    do {
        if (flag8h == NEW8H)
            delayend = pctimer_get_ticks();
        else
            delayend = biostime(0, 0);
    } while ((delayend - delaybegin) < delaytick);
}

void pctimer_sound(int freq, int duration) {
    int byte;
    unsigned int freq1;

    freq1 = PITCONST / freq;
    outportb(PITMODE, 0xb6);
    byte = (freq1 & 0xff);
    outportb(PIT2, byte);
    byte = (freq1 >> 8);
    outportb(PIT2, byte);
    byte = inportb(KBCTRL);
    outportb(KBCTRL, (byte | 3));

    pctimer_sleep(duration);
    outportb(KBCTRL, (byte & 0xfc));
}

char *get_cmostime(void) {
    char *buff;
    static char buffer[6];
    char ch;

    buff = buffer;
    memset(&r, 0, sizeof(r));
    r.h.ah = 0x02;
    _go32_dpmi_simulate_int(0x1a, &r);

    ch = r.h.ch;
    buffer[0] = (char)((int)(ch & 0x0f) + (int)((ch >> 4) & 0x0f) * 10);
    ch = r.h.cl;
    buffer[1] = (char)((int)(ch & 0x0f) + (int)((ch >> 4) & 0x0f) * 10);
    ch = r.h.dh;
    buffer[2] = (char)((int)(ch & 0x0f) + (int)((ch >> 4) & 0x0f) * 10);
    buffer[3] = r.h.dl;
    buffer[4] = (char)(r.x.flags & 0x0001);
    buffer[5] = 0x00;

    return (buff);
}

void pctimer_set_hook(void (*proc)()) { hook_function = proc; }
