var DELAY = 500;

IntenseVideo();

var scr = new Screen();

// scr.Put(0, 0, "Fail");

for (var i = 1; i < scr.Height; i++) {
	scr.Put(40, i, "Line: " + i);
}

scr.TextColor(WHITE);
scr.Put(1, 1, "1234567890");
scr.ToDisplay();
Sleep(DELAY);

scr.TextColor(RED);
scr.Put(2, 2, "1234567890");
scr.ToDisplay();
Sleep(DELAY);

scr.TextBackground(GREEN);
scr.Put(3, 3, "1234567890");
scr.ToDisplay();
Sleep(DELAY);

for (var i = 0; i < 16; i++) {
	scr.TextColor(i);
	scr.TextBackground(BLACK);
	scr.Put(1, 10 + i, "FgColor " + i);

	scr.TextColor(BLACK);
	scr.TextBackground(i);
	scr.Put(20, 10 + i, "BgColor " + i);
}
scr.ToDisplay();
Sleep(DELAY);


scr.TextBackground(RED);
scr.Clear();
scr.ToDisplay();
Sleep(DELAY);
