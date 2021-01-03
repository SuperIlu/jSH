// test first library
try {
	Println(HelloWorld("FAILS"));
} catch (e) {
	Println(e);
}

LoadLibrary("dxetest");

Println(HelloWorld("WORKS"));


// test second library
try {
	Println(MakeString());
} catch (e) {
	Println(e);
}

LoadLibrary("dxetest2");

Println(MakeString());
