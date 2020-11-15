**V0.5 backport to musj**
* switched back to MuJS for DOjS compatibility
* added watt32 TCP/IP support
* added raw disks access
* unified code base with [DOjS](https://github.com/SuperIlu/DOjS)

**V0.4 added IO-port access**
* jSH can now access hardware directly by using OutPortByte()/InPortByte(), etc
* Added RandomInt() and String.startsWith()/String.endsWith()
* Added POST() function to display debug info using a ISA/PCI POST card

**V0.3 added COM port access**
* Added DZComm for COM port access.

**V0.2 new JS engine**
* Switched from MuJS to duktape JS engine.

**V0.1 initial release on GitHub**
* Basic file and console io.
* JsCommander example script.
