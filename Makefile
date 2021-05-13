###
# Makefile for cross compiling jSH for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###
# enter the path to x-djgpp here
#DJGPP=/Users/iluvatar/tmp/djgpp/bin
DJGPP=/home/ilu/djgpp/bin

# subdirs
MUJS		= mujs-1.0.5
DZCOMMDIR	= dzcomm
LIBDZCOMM	= $(DZCOMMDIR)/lib/djgpp/libdzcom.a
WATT32		= watt32-2.2dev.rel.11/
KUBAZIP		= zip

# compiler
CDEF		= -DGC_BEFORE_MALLOC #-DDEBUG_ENABLED #-DMEMDEBUG 
CFLAGS		= -MMD -Wall -std=gnu99 -O2 -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -Wmissing-prototypes $(CDEF)
INCLUDES	= -I$(realpath $(MUJS)) -I$(realpath $(DZCOMMDIR))/include -I$(realpath $(WATT32))/inc -I$(realpath $(KUBAZIP))/src -I$(realpath .)

# linker
LIBS		= -lmujs -lm -lemu -ldzcom -lwatt
LDFLAGS		= -L$(MUJS)/build/release -L$(DZCOMMDIR)/lib/djgpp -L$(WATT32)/lib

# output
EXE				= JSH.EXE
RELZIP			= jsh.zip

# dirs/files
BUILDDIR		= build
DOCDIR			= doc/html
DXE_TEMPLATE	= dxetemplate.txt
DXE_EXPORTS		= dexport.c

CROSS=$(DJGPP)/i586-pc-msdosdjgpp
CROSS_PLATFORM=i586-pc-msdosdjgpp-
CC=$(DJGPP)/$(CROSS_PLATFORM)gcc
AR=$(DJGPP)/$(CROSS_PLATFORM)ar
LD=$(DJGPP)/$(CROSS_PLATFORM)ld
STRIP=$(DJGPP)/$(CROSS_PLATFORM)strip
RANLIB=$(DJGPP)/$(CROSS_PLATFORM)ranlib
DXE3GEN = dxe3gen
DXE3RES = dxe3res
export

PARTS= \
	$(BUILDDIR)/zip/src/zip.o \
	$(BUILDDIR)/file.o \
	$(BUILDDIR)/funcs.o \
	$(BUILDDIR)/jsconio.o \
	$(BUILDDIR)/zipfile.o \
	$(BUILDDIR)/watt.o \
	$(BUILDDIR)/socket.o \
	$(BUILDDIR)/lowlevel.o \
	$(BUILDDIR)/jSH.o \
	$(BUILDDIR)/dexport.o

DXE_DIRS := $(wildcard *.dxelib)

all: init libmujs dzcomm libwatt32 $(EXE) $(DXE_DIRS)

libmujs: $(MUJS)/build/release/libmujs.a

dzcomm: $(LIBDZCOMM)

libwatt32: $(WATT32)/lib/libwatt.a

$(LIBDZCOMM):
	$(MAKE) -C $(DZCOMMDIR) lib/djgpp/libdzcom.a

$(MUJS)/build/release/libmujs.a:
	$(MAKE) -C $(MUJS) build/release/libmujs.a

$(WATT32)/lib/libwatt.a:
	DJ_PREFIX=$(DJGPP) $(MAKE) -C $(WATT32)/src -f DJGPP.MAK

$(EXE): $(PARTS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)
	$(STRIP) $@

$(BUILDDIR)/%.o: %.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILDDIR)/zip/src/%.o: $(KUBAZIP)/src/%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(DXE_DIRS):
	$(MAKE) -C $@

$(DXE_EXPORTS): dxetemplate.txt $(MUJS)/mujs.h
	python3 ./extract_functions.py $(DXE_TEMPLATE) $(MUJS)/mujs.h $@

zip: all doc
	rm -f $(RELZIP)
	zip -9 -v -r $(RELZIP) $(EXE) JC.JS JC.BAT CWSDPMI.EXE LICENSE README.md CHANGELOG.md jsboot/ scripts/ $(DOCDIR) *.dxe

doc:
	rm -rf $(DOCDIR)
	mkdir -p $(DOCDIR)
	cd doc && jsdoc -c jsdoc.conf.json -d ../$(DOCDIR)
	cp doc/*.png $(DOCDIR)

init:
	mkdir -p $(BUILDDIR) $(BUILDDIR)/zip/src
	# make sure compile time is always updated
	rm -f $(BUILDDIR)/jSH.o

clean:
	rm -rf $(BUILDDIR)/
	rm -f $(PARTS) $(EXE) $(ZIP) JSLOG.TXT
	for dir in $(DXE_DIRS); do \
		$(MAKE) -C $$dir -f Makefile $@; \
	done

distclean: clean jsclean dzclean wattclean dxeclean
	rm -rf $(DOCDIR) TEST.TXT JSLOG.TXT *.dxe

dzclean:
	$(MAKE) -C $(DZCOMMDIR) clean

jsclean:
	$(MAKE) -C $(MUJS) clean

wattclean:
	$(MAKE) -C $(WATT32)/src -f DJGPP.MAK clean

zclean:
	$(MAKE) -C $(ZLIB) -f Makefile.dojs clean

dxeclean:
	rm -f $(DXE_EXPORTS)

fixnewlines:
	find . -iname *.sh -exec dos2unix -v \{\} \;

.PHONY: clean distclean init doc $(DXE_DIRS)

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
