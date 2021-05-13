**V0.8 fixes, fixes, fixes**
* fixed internal version number, now reports itself as 0.8, 0.7 did report itself as 0.6. https://github.com/SuperIlu/jSH/issues/4
* `Quit()` now takes an optional numerical parameter, `Exit()` now exists as alias to `Quit()`. https://github.com/SuperIlu/jSH/issues/6
* There is a new function `CtrlBreak()` which enables/disables handling of CTRL-C during script runtime. https://github.com/SuperIlu/jSH/issues/5
* HTML documentation will now contain the PNGs shown on the GitHub page. https://github.com/SuperIlu/jSH/issues/7
* The creation of JSLOG.TXT can now be suppressed on the command line (option "-n") or the logdata redirected to another file (option "-l"). https://github.com/SuperIlu/jSH/issues/9

**V0.7 more modules support**
* added SQLite module
* added neuronal network module
* added libcpuid

**V0.6 native library loading support**
* added support to load DXEs during runtime to extend functionality
* moved comport to a loadable library
* re-added `KbHit()`

**V0.5 backport to musj**
* switched back to MuJS for DOjS compatibility
* added watt32 TCP/IP support
* added raw disks access
* unified code base with [DOjS](https://github.com/SuperIlu/DOjS)

**V0.4 added IO-port access**
* jSH can now access hardware directly by using `OutPortByte()`/`InPortByte()`, etc
* Added `RandomInt()` and `String.startsWith()`/`String.endsWith()`
* Added `POST()` function to display debug info using a ISA/PCI POST card

**V0.3 added COM port access**
* Added DZComm for COM port access.

**V0.2 new JS engine**
* Switched from MuJS to duktape JS engine.

**V0.1 initial release on GitHub**
* Basic file and console io.
* JsCommander example script.
