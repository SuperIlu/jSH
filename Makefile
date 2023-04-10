###
# Makefile for cross compiling jSH for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###

# subdirs
THIRDPARTY	= 3rdparty/
MUJS		= $(THIRDPARTY)/mujs-1.0.5
DZCOMMDIR	= $(THIRDPARTY)/dzcomm
KUBAZIP		= $(THIRDPARTY)/zip-0.2.3
ZLIB		= $(THIRDPARTY)/zlib-1.2.12
PCTIMER     = $(THIRDPARTY)/pctimer
INI			= $(THIRDPARTY)/ini-20220806/src
WATT32		= $(THIRDPARTY)/Watt-32
CURL		= $(THIRDPARTY)/curl-8.0.1
MBEDTLS		= $(THIRDPARTY)/mbedtls-2.28.3

JSDOC_TEMPLATES=/home/ilu/.nvm/versions/node/v17.4.0/lib/node_modules/better-docs /usr/lib/node_modules/better-docs /tmp

LIB_DZCOMM	= $(DZCOMMDIR)/lib/djgpp/libdzcom.a
LIB_MUJS	= $(MUJS)/build/release/libmujs.a
LIB_WATT	= $(WATT32)/lib/libwatt.a
LIB_Z		= $(ZLIB)/libz.a
LIB_MBEDTLS = $(MBEDTLS)/library/libmbedtls.a
LIB_CURL	= $(CURL)/libcurl.a

# compiler
CDEF		= -DGC_BEFORE_MALLOC #-DDEBUG_ENABLED #-DMEMDEBUG 
CFLAGS		= -MMD -Wall -std=gnu99 -O2 -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -Wmissing-prototypes $(CDEF)
INCLUDES	= \
	-I$(realpath $(MUJS)) \
	-I$(realpath $(DZCOMMDIR))/include \
	-I$(realpath $(WATT32))/inc \
	-I$(realpath $(KUBAZIP))/src \
	-I$(realpath $(ZLIB)) \
	-I$(realpath $(MBEDTLS))/include \
	-I$(realpath $(CURL))/include \
	-I$(realpath $(PCTIMER)) \
	-I$(realpath $(INI))/ \
	-I$(realpath ./src/)

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
DXE_EXPORTS		= src/dexport.c

CROSS=i586-pc-msdosdjgpp
CROSS_PLATFORM=i586-pc-msdosdjgpp-
CC=$(CROSS_PLATFORM)gcc
AR=$(CROSS_PLATFORM)ar
LD=$(CROSS_PLATFORM)ld
STRIP=$(CROSS_PLATFORM)strip
RANLIB=$(CROSS_PLATFORM)ranlib
DXE3GEN = dxe3gen
DXE3RES = dxe3res
export

PARTS= \
	$(BUILDDIR)/zip.o \
	$(BUILDDIR)/pctimer/gccint8.o \
	$(BUILDDIR)/file.o \
	$(BUILDDIR)/funcs.o \
	$(BUILDDIR)/jsconio.o \
	$(BUILDDIR)/zipfile.o \
	$(BUILDDIR)/watt.o \
	$(BUILDDIR)/socket.o \
	$(BUILDDIR)/lowlevel.o \
	$(BUILDDIR)/jSH.o \
	$(BUILDDIR)/intarray.o \
	$(BUILDDIR)/bytearray.o \
	$(BUILDDIR)/util.o \
	$(BUILDDIR)/screen.o \
	$(BUILDDIR)/inifile.o \
	$(BUILDDIR)/ini/ini.o \
	$(BUILDDIR)/dexport.o

DXE_DIRS := $(wildcard *.dxelib)

all: init libmujs dzcomm libwatt32 libz libcurl $(EXE) $(DXE_DIRS) JSBOOT.ZIP

dzcomm: $(LIB_DZCOMM)
$(LIB_DZCOMM):
	$(MAKE) -C $(DZCOMMDIR) lib/djgpp/libdzcom.a

libmujs: $(LIB_MUJS)
$(LIB_MUJS):
	$(MAKE) -C $(MUJS) build/release/libmujs.a

libcurl: $(LIB_CURL)
$(LIB_CURL): $(LIB_MBEDTLS) $(LIB_Z)
	$(MAKE) $(MPARA) -C $(CURL)/lib -f Makefile.mk CFG=-zlib-mbedtls-watt TRIPLET=i586-pc-msdosdjgpp WATT_ROOT=$(WATT32)

libmbedtls: $(LIB_MBEDTLS)
$(LIB_MBEDTLS):
	$(MAKE) $(MPARA) -C $(MBEDTLS) -f Makefile lib

libwatt32: $(LIB_WATT)
$(LIB_WATT):
	DJ_PREFIX=$(dir $(shell which $(CC))) $(MAKE) $(MPARA) -C $(WATT32)/src -f djgpp.mak

libz: $(LIB_Z)
$(LIB_Z):
	$(MAKE) $(MPARA) -C $(ZLIB) -f Makefile.dojs

$(EXE): $(PARTS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)
	$(STRIP) $@

$(BUILDDIR)/%.o: src/%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILDDIR)/pctimer/%.o: $(PCTIMER)/%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILDDIR)/%.o: $(KUBAZIP)/src/%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILDDIR)/ini/%.o: $(INI)/%.c Makefile
	$(CC) $(CFLAGS) -c $< -o $@

$(DXE_DIRS):
	$(MAKE) -C $@

$(DXE_EXPORTS): dxetemplate.txt $(MUJS)/mujs.h
	python3 ./extract_functions.py $(DXE_TEMPLATE) $(MUJS)/mujs.h $@

JSBOOT.ZIP: $(shell find jsboot/ -type f)
	rm -f $@
	zip -9 -r $@ jsboot/

zip: all doc
	rm -f $(RELZIP)
	curl --remote-name --time-cond cacert.pem https://curl.se/ca/cacert.pem
	zip -9 -v -r $(RELZIP) $(EXE) JC.JS JC.BAT CWSDPMI.EXE LICENSE README.md CHANGELOG.md JSBOOT.ZIP JPM.BAT cacert.pem scripts/ $(DOCDIR) *.dxe

doc:
	rm -rf $(DOCDIR)
	mkdir -p $(DOCDIR)
	for i in $(JSDOC_TEMPLATES); do [ -d $$i ] && cd doc && jsdoc --verbose -t $$i -c jsdoc.conf.json -d ../$(DOCDIR) && break; done
	cp doc/*.png $(DOCDIR)

init:
	mkdir -p $(BUILDDIR) $(BUILDDIR)/zip/src $(BUILDDIR)/pctimer $(BUILDDIR)/ini
	# make sure compile time is always updated
	rm -f $(BUILDDIR)/jSH.o

clean:
	rm -rf $(BUILDDIR)/
	rm -f $(PARTS) $(EXE) $(ZIP) JSLOG.TXT JSBOOT.ZIP cacert.pem
	for dir in $(DXE_DIRS); do \
		$(MAKE) -C $$dir -f Makefile $@; \
	done

distclean: clean jsclean dzclean wattclean dxeclean muclean zclean mbedtlsclean curlclean
	rm -rf $(DOCDIR) TEST.TXT JSLOG.TXT *.dxe

dzclean:
	$(MAKE) -C $(DZCOMMDIR) clean

jsclean:
	$(MAKE) -C $(MUJS) clean

zclean:
	$(MAKE) -C $(ZLIB) -f Makefile.dojs clean

dxeclean:
	rm -f $(DXE_EXPORTS)

muclean:
	rm -f $(MUJS)/build/release/libmujs.a

apclean:
	$(MAKE) -C $(ALPNG) -f Makefile.zlib clean

mbedtlsclean:
	$(MAKE) -C $(MBEDTLS) -f Makefile clean

curlclean:
	$(MAKE) $(MPARA) -C $(CURL)/lib -f Makefile.mk CFG=-zlib-mbedtls-watt TRIPLET=i586-pc-msdosdjgpp WATT_ROOT=$(WATT32) clean
	rm -f $(CURL)/lib/libcurl.a

wattclean:
	$(MAKE) -C $(WATT32)/src -f djgpp.mak clean

fixnewlines:
	find . -iname *.sh -exec dos2unix -v \{\} \;

.PHONY: clean distclean init doc $(DXE_DIRS)

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
