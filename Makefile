###
# Makefile for cross compiling DOjS for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###
# enter the path to x-djgpp here
#DJGPP=/Users/iluvatar/tmp/djgpp/bin
DJGPP=/home/ilu/djgpp/bin

MUJS=mujs

INCLUDES=-I$(MUJS)
LIBS=-lmujs -lm -lemu

CFLAGS=-MMD -Wall -O2 -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -DDEBUG_ENABLED
#CFLAGS=-MMD -Wall -Os -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -DDEBUG_ENABLED
LDFLAGS=-L$(MUJS)/build/release

EXE=JSH.EXE
ZIP=JSH.ZIP

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
	$(BUILDDIR)/file.o \
	$(BUILDDIR)/funcs.o \
	$(BUILDDIR)/jsconio.o \
	$(BUILDDIR)/jSH.o

all: init libmujs $(EXE)

libmujs: $(MUJS)/build/release/libmujs.a

$(MUJS)/build/release/libmujs.a:
	$(MAKE) -C $(MUJS) build/release/libmujs.a

$(EXE): $(PARTS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)
	$(STRIP) $@

$(BUILDDIR)/%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

zip: all doc
	rm -f $(ZIP)
	zip -9 -v -r $(ZIP) $(EXE) JC.JS JC.BAT CWSDPMI.EXE LICENSE README.md CHANGELOG.md jsboot/ $(DOCDIR)

doc:
	rm -rf $(DOCDIR)
	mkdir -p $(DOCDIR)
	cd doc && jsdoc -c jsdoc.conf.json -d ../$(DOCDIR)

init:
	mkdir -p $(BUILDDIR)

clean:
	rm -rf $(BUILDDIR)/
	rm -f $(EXE) $(ZIP) JSLOG.TXT

distclean: clean
	$(MAKE) -C $(MUJS) clean
	rm -rf $(DOCDIR) TEST.TXT JSLOG.TXT

.PHONY: clean distclean init doc

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
