/* PCTIMER 1.4
   Millisecond Resolution Timing Library for DJGPP V2
   Release Date: 3/15/1998
   Chih-Hao Tsai (hao520@yahoo.com)
 */

void pctimer_init (unsigned int);
void pctimer_exit (void);
void rm_new8h (void);
void lock_rm_new8h (void);
void pm_new8h (void);
void lock_pm_new8h (void);
unsigned long pctimer_get_ticks (void);
unsigned long pctimer_time (unsigned long, unsigned long);
void pctimer_sleep (unsigned int);
void pctimer_sound (int, int);
char *get_cmostime (void);
