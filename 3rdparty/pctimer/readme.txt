PCTIMER: Millisecond Resolution Timing Library for DJGPP V2
Version 1.4 Release Notes
March 15, 1998
Status: Freeware.
Distribution status: Has to be distributed as this archive.
Send comments to: Chih-Hao Tsai (hao520@yahoo.com).


==== A FEW WORDS ON WIN95

Although I have only tested PCTIMER with Win95 and CWSDPMI, 
PCTIMER should run on most DPMI servers.

However, theoretically, applications running under Win95 
should not touch hardware interrupts.  The "correct" method 
of doing millisecond resolution timing under Win95 is to call 
Windows API.  The standard Multimedia Timer API can do 
millisecond resolution timing.  (You'll need to include 
<mmsystem.h> and link with winmm.lib.  But, as far as I know, 
RSXNT does not provide Multimedia API access.)

If you need an example on using Windows API to do millisecond 
resolution timing, check this out (I used Visual C++ 4.0):

Test Report: Millisecond Resolution Timing with Win95/VC4
http://www.geocities.com/hao510/w98timer/


==== BASIC LOGIC

PCTIMER reprograms the 8454 IC (Programmable Interrupt Timer) 
to get high frequency of System Timer Interrupt (IRQ0) whose 
default frequency is 18.2 Hz.  Since the operating systems 
rely heavily on the System Timer Interrupt, increasing its 
frequency could cause instability.  PCTIMER hooks both 
protected and real mode int 8h handlers (default handler for 
System Timer Interrupt) reprograms 8254 to get higher 
frequency of interrupts, but calls the original handlers at 
a fixed frequency of 18.2 Hz.


==== RELATIONSHIP BETWEEN PROTECTED & REAL MODE INT 8H

According to DJGPP V2 FAQ, hardware interrupts are always 
passed to protected mode first, and only if unhandled are 
they reflected to real mode.  In other words, we must at least 
hook protected mode int 8h.  To avoid potential loss of ticks 
when the protected mode fails to handle the hardware 
interrupt, we should also hook real mode int 8h.

In actual implementation of the two handlers, things become 
much more complex than that.


==== PCTIMER PROTECTED MODE INT8H HANDLER

Here is PCTIMER's protected mode int 8h in pseudo code.  The 
meanings of pm_termination_flag's values are:

TRUE_FAILURE: The handler failed to handle the hardware 
interrupt.

CHAIN_TERMINATION: The handler terminated with chaining to 
the old handler.  Note that after chaining the old protected 
mode int 8h handler, the *real* mode int 8h *will* get called.  
We need to take care of this.

OUTPORTB_TERMINATION: The handler terminated with an 
outportb (0x20, 0x20) instruction.  This instruction sends 
a hardware request to the Interrupt Controller to terminate 
the interrupt.  This works (although intrusive), but will 
cause the DPMI server to believe that the protected mode 
handler failed to do its job.  Therefore, the real mode 
handler *will* get called.  We need to take care of this, 
too.

(Read the real code for details.)

PCTIMER Protected Mode Int 8h Handler (Pseudo-code)
  * pm_termination_flag = TRUE_FAILURE
  * counter++
  * if it is time to chain old handler
      - pm_termination_flag = CHAIN_TERMINATION
      - let the wrapper chains the old handler
  * else
      - pm_termination_flag = OUTPORTB_TERMINATION
      - outportb (0x20, 0x20)


==== PCTIMER REAL MODE INT8H HANDLER

The real mode handler is considerably more complex than the 
protected mode one.  It depends on pm_termination_flag to 
determine how it should behave.  Always set 
pm_termination_flag to TRUE_FAILURE before we leave, so in 
case the protected mode handler should fail, the real mode 
handler can detect it next time.

(Read the real code for details.)

PCTIMER Real Mode Int 8h Handler (Pseudo-code)
  * if pm_termination_flag = TRUE_FAILURE	
      - counter++
  * if it is time to chain the old handler, or if the protected 
      mode handler decided to do that (i.e., 
      pm_termination_flag = CHAIN_TERMINATION)
      - call old real mode handler
      - pm_termination_flag = TRUE_FAILURE
  * else
      - outportb (0x20, 0x20)
      - pm_termination_flag = TRUE_FAILURE


==== Example of Usage

#include <gccint8.h>

void main (void)
{
  unsigned long int start, finish, elapsed_time;

  /* initiate the timer with 1/1000 s resolution */
  /* you can use different resolution, but resolution */
  /* higher than 1000 is not recommended. */

  pctimer_init (1000);

  start = pctimer_get_ticks ();
  /* do some stuff here */
  finish = pctimer_get_ticks ();
  elapsed_time = pctimer_time (start, finish);
  /* always returns elapsed time in the unit of ms. */

  pctimer_sleep (200); /* sleep 200 ms */
  pctimer_sound (800, 200); /* 800 Hz sound for 200 ms */

  /* never forget to exit the timer!!! */
  /* otherwise, the system WILL crash!!! */

  pctimer_exit (); 
}


==== HISTORY
3/15/98		Version 1.4
11/26/95	Version 1.3
1/29/95		Version 1.2
1/16/95		Version 1.1
11/5/94		Version 1.0


==== DISCLAIMER

I am not at all responsible for any damages, consequential 
or incidental, and by using PCTIMER, you are agreeing not 
to hold either of the above responsible for any problems 
whatsoever.
