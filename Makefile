###
# Makefile for cross compiling DOjS for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###
# enter the path to x-djgpp here
#DJGPP=/Users/iluvatar/tmp/djgpp/bin
DJGPP=/home/ilu/djgpp/bin

MUJS=mujs-1.0.5
DZCOMMDIR=dzcomm
LIBDZCOMM=$(DZCOMMDIR)/lib/djgpp/libdzcom.a
WATT32=watt32-2.2dev.rel.11/
KUBAZIP=zip

INCLUDES=-I$(MUJS) -I$(DZCOMMDIR)/include -I$(WATT32)/inc -I$(KUBAZIP)/src
LIBS=-lmujs -lm -lemu -ldzcom -lwatt

CDEF=-DGC_BEFORE_MALLOC #-DDEBUG_ENABLED #-DMEMDEBUG 
CFLAGS=-MMD -Wall -std=gnu99 -O2 -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -Wmissing-prototypes $(CDEF)
LDFLAGS=-L$(MUJS)/build/release -L$(DZCOMMDIR)/lib/djgpp -L$(WATT32)/lib

EXE=JSH.EXE
RELZIP=jsh.zip

BUILDDIR=build

DOCDIR=doc/html

CROSS=$(DJGPP)/i586-pc-msdosdjgpp
CROSS_PLATFORM=i586-pc-msdosdjgpp-
CC=$(DJGPP)/$(CROSS_PLATFORM)gcc
AR=$(DJGPP)/$(CROSS_PLATFORM)ar
LD=$(DJGPP)/$(CROSS_PLATFORM)ld
STRIP=$(DJGPP)/$(CROSS_PLATFORM)strip
RANLIB=$(DJGPP)/$(CROSS_PLATFORM)ranlib
export

PARTS= \
	$(BUILDDIR)/zip/src/zip.o \
	$(BUILDDIR)/file.o \
	$(BUILDDIR)/comport.o \
	$(BUILDDIR)/funcs.o \
	$(BUILDDIR)/jsconio.o \
	$(BUILDDIR)/zipfile.o \
	$(BUILDDIR)/watt.o \
	$(BUILDDIR)/socket.o \
	$(BUILDDIR)/lowlevel.o \
	$(BUILDDIR)/jSH.o

all: init libmujs dzcomm libwatt32 $(EXE)

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

zip: all doc
	rm -f $(RELZIP)
	zip -9 -v -r $(RELZIP) $(EXE) JC.JS JC.BAT CWSDPMI.EXE LICENSE README.md CHANGELOG.md jsboot/ scripts/ $(DOCDIR)

doc:
	rm -rf $(DOCDIR)
	mkdir -p $(DOCDIR)
	cd doc && jsdoc -c jsdoc.conf.json -d ../$(DOCDIR)

init:
	mkdir -p $(BUILDDIR) $(BUILDDIR)/zip/src
	# make sure compile time is always updated
	rm -f $(BUILDDIR)/jSH.o

clean:
	rm -rf $(BUILDDIR)/
	rm -f $(PARTS) $(EXE) $(ZIP) JSLOG.TXT

distclean: clean jsclean dzclean wattclean
	rm -rf $(DOCDIR) TEST.TXT JSLOG.TXT

dzclean:
	$(MAKE) -C $(DZCOMMDIR) clean

jsclean:
	$(MAKE) -C $(MUJS) clean

wattclean:
	$(MAKE) -C $(WATT32)/src -f DJGPP.MAK clean

zclean:
	$(MAKE) -C $(ZLIB) -f Makefile.dojs clean

fixnewlines:
	find . -iname *.sh -exec dos2unix -v \{\} \;

.PHONY: clean distclean init doc

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
