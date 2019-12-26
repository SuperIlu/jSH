# jSH
![jSH logo](/doc/jSH.png)
## A Javascript scripting engine for DOS
[jSH](https://github.com/SuperIlu/jSH) is a script interpreter for DOS based operating systems like MS-DOS, [FreeDOS](http://freedos.org/) or any DOS based Windows (like 95, 98, ME). The focus is on file io and text mode user interfaces.

jSH is a side project to [DOjS](https://github.com/SuperIlu/DOjS), a Javascript canvas for creative coding.

The following script e.g. renames all file extensions in a given directory:
```Javascript
if (args.length < 3) {
	Println("Usage:");
	Println("   jSH.exe renall.js <dir> <old ext> <new ext>");
	Exit(1);
}

var dir = args[0];
var oldExt = args[1].toUpperCase();
var newExt = args[2].toUpperCase();

var files = List(dir);
for (var i = 0; i < files.length; i++) {
	var oldName = files[i].toUpperCase();
	if (oldName.lastIndexOf(oldExt) != -1) {
		var baseName = oldName.substring(0, oldName.lastIndexOf(oldExt));
		var newName = baseName + newExt;
		Println(dir + "\\" + oldName + " => " + dir + "\\" + newName);
		Rename(dir + "\\" + oldName, dir + "\\" + newName);
	}
}
Println("All done...");
```
And can be run like this: `JSH.EXE RENALL.JS SOMEDIR .FOO .BAR` to rename all files ending in `.FOO` to `.BAR`.

jSH was only possible due to the work of these people/projects:
* [Duktape](https://duktape.org/) JavaScript interpreter
* [DJGPP](http://www.delorie.com/djgpp/) from DJ Delorie and the [Linux compile scripts](https://github.com/andrewwutw/build-djgpp) by Andrew Wu.

You can find me on [Twitter](https://twitter.com/dec_hl) if you want...

# Download and quick start
**You can find binary releases on the [GitHub release page](https://github.com/SuperIlu/jSH/releases). Just extract the contents of the archive and run jSH.**

jSH runs in [Dosbox](https://www.dosbox.com/) and on real hardware or a virtual machine with MS-DOS, [FreeDOS](https://www.freedos.org/) or any DOS based Windows like Windows 95/98/ME.

If you run it on real hardware you need at least a **80386 with 4MB**. I recommend a **Pentium class machine with at least 8MB RAM**.

The API is documented in the [doc/html/](http://htmlpreview.github.io/?https://github.com/SuperIlu/jSH/blob/master/doc/html/index.html) directory.

For now jSH comes only with a single bigger example: *JsCommander*. A minimal file manager in the style of the well known Norton Commander.
![jc screenshot](/doc/JsCommander.PNG)


# Compilation
You can compile jSH on any modern Linux (the instructions below are for Debian based distributions) or on Windows 10 using Windows Subsystem for Linux (WSL).
Setup Windows Subsystem for Linux (WSL) according to [this](https://docs.microsoft.com/en-us/windows/wsl/install-win10) guide (I used Ubuntu 18.04 LTS).

## Preparation
Build and install DJGPP 7.2.0 according to [this](https://github.com/andrewwutw/build-djgpp) guide.
I used the following command lines to update/install my dependencies:
```bash
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install bison flex curl gcc g++ make texinfo zlib1g-dev g++ unzip htop screen git bash-completion build-essential npm python-yaml
sudo npm install -g jsdoc
sudo npm install -g tui-jsdoc-template
```

And the following commands to build and install DJGPP to `/home/ilu/djgpp`.:
```bash
git clone https://github.com/andrewwutw/build-djgpp.git
cd build-djgpp
export DJGPP_PREFIX=/home/ilu/djgpp
./build-djgpp.sh 7.2.0
```

## Getting & Compiling jSH
Open a shell/command line in the directory where you want the source to reside.

Checkout jSH from Github:
```bash
git clone https://github.com/SuperIlu/jSH.git
```

Open the Makefile in a text editor and change the path to DJGPP according to your installation.

Now you are ready to compile jSH with `make clean all`. This might take some time as the dependencies are quite a large.
`make distclean` will clean dependencies as well. `make zip` will create the distribution ZIP and `make doc` will re-create the HTML help.

# History
See the [changelog](/CHANGELOG.md) for the projects history.

# Licenses
## jSH
All code from me is released under **MIT license**.

## Duktape
Duktape is released under **MIT license**. See *LICENSE.txt* in the duktape folder for details.

## DZComm
DZComm serial library is release as **gift-ware**. See *readme.txt* in the dzcomm folder for details.

## CWSDPMI.EXE
[CWSDPMI](http://sandmann.dotster.com/cwsdpmi/) DPMI host is licensed under **GPL**. The documentation states:
> The files in this binary distribution may be redistributed under the GPL (with source) or without the source code provided.

