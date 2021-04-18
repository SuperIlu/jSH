Println(JSON.stringify(GetLoadedLibraries()));

// test first library
try {
	Println(HelloWorld("FAILS"));
} catch (e) {
	Println(e);
}

LoadLibrary("dxetest");

Println(HelloWorld("WORKS"));

Println(JSON.stringify(GetLoadedLibraries()));


// test second library
try {
	Println(MakeString());
} catch (e) {
	Println(e);
}

LoadLibrary("dxetest2");

Println(MakeString());

Println(JSON.stringify(GetLoadedLibraries()));

// test sanity check
LoadLibrary("dxetest");
