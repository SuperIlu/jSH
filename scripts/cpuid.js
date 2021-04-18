Println(JSON.stringify(GetLoadedLibraries()));

LoadLibrary("cpuid");

Println("NumCpus=" + NumCpus());
Println("HasCpuId=" + HasCpuId());
Println("CpuId=" + JSON.stringify(CpuId()));
Debugln("CpuId=" + JSON.stringify(CpuId()));
