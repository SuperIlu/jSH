#include <stdio.h>
#include "gccint8.h"


void
main (void)
{
  int i;
  unsigned long int start, finish;
  int elapsedtime[50], sum = 0;
  float average_error;

  printf ("PCTIMER14 Test. (Millisecond resolution.)\n");
  printf ("Press any key to begin the test. (It lasts for 5.35 seconds.)\n\n");
  getch ();
  printf ("Test in progress.  Please wait...\n");
  pctimer_sound (800, 200);

  pctimer_init (1000);

  for (i = 0; i < 50; i++)
    {
      start = pctimer_get_ticks ();
      pctimer_sleep (107);
      finish = pctimer_get_ticks ();
      elapsedtime[i] = (int) pctimer_time (start, finish);
    }

  pctimer_exit ();

  pctimer_sound (800, 200);
  printf ("Test finished.\n");
  printf ("Press any key to display the result...\n");
  getch ();

  for (i = 0; i < 50; i++)
    {
      sum += (elapsedtime[i] - 107);
      printf ("iteration:%d  expected:107  observed:%ld  difference:%d\n", i + 1, elapsedtime[i], elapsedtime[i] - 107);
      if ((i + 1) % 20 == 0)
	{
	  printf ("Press any key to display next page...\n");
	  getch ();
	}
    }

  average_error = (float) sum / 50;
  printf ("\ntotal error:%d ms  average error:%.2f ms\n", sum, average_error);
}
