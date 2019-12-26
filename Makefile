###
# Makefile for cross compiling DOjS for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###
# enter the path to x-djgpp here
#DJGPP=/Users/iluvatar/tmp/djgpp/bin
DJGPP=/home/ilu/djgpp/bin

DUKTAPE=duktape-2.5.0
DUKOUT=$(DUKTAPE)/djgpp
DUKSRC=$(DUKOUT)/duktape.c
DUKOBJ=$(DUKOUT)/duktape.o

DZCOMMDIR=dzcomm
LIBDZCOMM=$(DZCOMMDIR)/lib/djgpp/libdzcom.a

CFLAGS=-MMD -Wall -O2 -march=i386 -mtune=i586 -fgnu89-inline -fomit-frame-pointer #-DDEBUG_ENABLED 
#CFLAGS=-MMD -Wall -Os -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -DDEBUG_ENABLED -std=c99 
CFLAGS += -DDUK_CMDLINE_PRINTALERT_SUPPORT -I$(DUKTAPE)/extras/print-alert -I$(DUKOUT) -I$(DZCOMMDIR)/include

LIBS=-lm -lemu -ldzcom -L$(DZCOMMDIR)/lib/djgpp

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
	$(DUKOBJ) \
	$(DUKTAPE)/extras/print-alert/duk_print_alert.o \
	$(BUILDDIR)/file.o \
	$(BUILDDIR)/comport.o \
	$(BUILDDIR)/funcs.o \
	$(BUILDDIR)/jsconio.o \
	$(BUILDDIR)/jSH.o

all: init dzcomm $(EXE)

duktape: $(DUKOBJ)

dzcomm: $(LIBDZCOMM)

$(LIBDZCOMM):
	$(MAKE) -C $(DZCOMMDIR) lib/djgpp/libdzcom.a

$(DUKSRC):
	$(DUKTAPE)/tools/configure.py \
		--output-directory $(DUKOUT)/ \
		--compiler=djgpp \
		--architecture=x32 \
		--platform=dos \
		--option-file=$(DUKTAPE)/config/examples/performance_sensitive.yaml \
		-DDUK_USE_FATAL_HANDLER

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
	rm -f $(PARTS) $(EXE) $(ZIP) JSLOG.TXT

distclean: clean
	rm -rf $(DUKOUT)
	$(MAKE) -C $(DZCOMMDIR) clean
	rm -rf $(DOCDIR) TEST.TXT JSLOG.TXT

.PHONY: clean distclean init doc

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
