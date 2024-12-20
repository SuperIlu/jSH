###
# Makefile for cross compiling jSH for FreeDOS/MS-DOS
# All compilation was done with DJGPP 7.2.0 built from https://github.com/andrewwutw/build-djgpp
###

# subdirs
THIRDPARTY	= 3rdparty/
MUJS		= $(THIRDPARTY)/mujs-1.0.5
DZCOMMDIR	= $(THIRDPARTY)/dzcomm
KUBAZIP		= $(THIRDPARTY)/zip-0.2.3
ZLIB		= $(THIRDPARTY)/zlib-1.3.1
PCTIMER     = $(THIRDPARTY)/pctimer
INI			= $(THIRDPARTY)/ini-20220806/src
WATT32		= $(THIRDPARTY)/Watt-32
CURL		= $(THIRDPARTY)/curl-8.11.0
MBEDTLS		= $(THIRDPARTY)/mbedtls-3.6.2

JSDOC_TEMPLATES ?= $(shell npm root)/better-docs $(shell npm root -g)/better-docs

LIB_DZCOMM	= $(DZCOMMDIR)/lib/djgpp/libdzcom.a
LIB_MUJS	= $(MUJS)/build/release/libmujs.a
LIB_WATT	= $(WATT32)/lib/libwatt.a
LIB_Z		= $(ZLIB)/libz.a
LIB_MBEDTLS = $(MBEDTLS)/library/libmbedtls.a
LIB_CURL	= $(CURL)/libcurl.a

# compiler
CDEF		= -DGC_BEFORE_MALLOC #-DDEBUG_ENABLED #-DMEMDEBUG 
CFLAGS		= -MMD -Wall -std=gnu99 -Os -march=i386 -mtune=i586 -ffast-math $(INCLUDES) -fgnu89-inline -Wmissing-prototypes $(CDEF)
INCLUDES	= \
	-I$(realpath $(MUJS)) \
	-I$(realpath $(DZCOMMDIR))/include \
	-I$(realpath $(WATT32))/inc \
	-I$(realpath $(KUBAZIP))/src \
	-I$(realpath $(ZLIB)) \
	-I$(realpath $(MBEDTLS))/include \
	-I$(realpath $(MBEDTLS))/library \
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
JSHPATH			= $(realpath .)
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

## other tools used in Makefile
AWKPRG		= awk
CATPRG		= cat
CPPRG		= cp
CUTPRG		= cut
CURLPRG		= curl
ECHOPRG		= echo
EGREPPRG	= egrep
FINDPRG		= find
GREPPRG		= grep
JSDOCPRG	= jsdoc
MKDIRPRG	= mkdir
PYTHONPRG	= python3
RMPRG		= rm
SEDPRG		= sed
SHPRG		= bash
SORTPRG		= sort
UNIQPRG		= uniq
ZIPPRG		= zip
FONTCONV	= GrxFntConv
NPM_INSTALL = npm install -g

PARTS= \
	$(BUILDDIR)/vgm.o \
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

DXE_DIRS := $(wildcard plugins/*.dxelib)

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
	$(PYTHONPRG) ./extract_functions.py $(DXE_TEMPLATE) $(MUJS)/mujs.h $@

JSBOOT.ZIP: $(shell find jsboot/ -type f)
	$(RMPRG) -f $@
	$(ZIPPRG) -9 -r $@ jsboot/

zip: all doc
	$(RMPRG) -f $(RELZIP)
	$(CURLPRG) -o CACERT.PEM https://curl.se/ca/cacert.pem
	$(ZIPPRG) -9 -v -r $(RELZIP) $(EXE) JC.JS JC.BAT CWSDPMI.EXE LICENSE README.md CHANGELOG.md JSBOOT.ZIP JPM.BAT CACERT.PEM scripts/ $(DOCDIR) *.dxe

doc:
	$(RMPRG) -rf $(DOCDIR)
	$(MKDIRPRG) -p $(DOCDIR)
	# if this fails add JSDOC_TEMPLATES='<location(s) to look for templates>' to your make invocation
	for i in $(JSDOC_TEMPLATES); do [ -d $$i ] && cd doc && $(JSDOCPRG) --verbose -t $$i -c jsdoc.conf.json -d ../$(DOCDIR) && break; done

init:
	$(MKDIRPRG) -p $(BUILDDIR) $(BUILDDIR)/zip/src $(BUILDDIR)/pctimer $(BUILDDIR)/ini
	# make sure compile time is always updated
	$(RMPRG) -f $(BUILDDIR)/jSH.o

clean:
	$(RMPRG) -rf $(BUILDDIR)/
	$(RMPRG) -f $(PARTS) $(EXE) $(ZIP) JSLOG.TXT JSBOOT.ZIP CACERT.PEM
	for dir in $(DXE_DIRS); do \
		$(MAKE) -C $$dir -f Makefile $@; \
	done

distclean: clean jsclean dzclean wattclean dxeclean muclean zclean mbedtlsclean curlclean
	$(RMPRG) -rf $(DOCDIR) TEST.TXT JSLOG.TXT *.dxe

dzclean:
	$(MAKE) -C $(DZCOMMDIR) clean

jsclean:
	$(MAKE) -C $(MUJS) clean

zclean:
	$(MAKE) -C $(ZLIB) -f Makefile.dojs clean

dxeclean:
	$(RMPRG) -f $(DXE_EXPORTS)

muclean:
	$(RMPRG) -f $(MUJS)/build/release/libmujs.a

apclean:
	$(MAKE) -C $(ALPNG) -f Makefile.zlib clean

mbedtlsclean:
	$(MAKE) -C $(MBEDTLS) -f Makefile clean

curlclean:
	$(MAKE) $(MPARA) -C $(CURL)/lib -f Makefile.mk CFG=-zlib-mbedtls-watt TRIPLET=i586-pc-msdosdjgpp WATT_ROOT=$(WATT32) clean
	$(RMPRG) -f $(CURL)/lib/libcurl.a

wattclean:
	$(MAKE) -C $(WATT32)/src -f djgpp.mak clean

fixnewlines:
	$(FINDPRG) . -iname *.sh -exec dos2unix -v \{\} \;

node_install:
	$(NPM_INSTALL) jsdoc
	$(NPM_INSTALL) better-docs
	$(NPM_INSTALL) @babel/core @babel/cli
	$(NPM_INSTALL) @babel/preset-env
	$(NPM_INSTALL) @babel/plugin-transform-exponentiation-operator

.PHONY: clean distclean init doc $(DXE_DIRS)

DEPS := $(wildcard $(BUILDDIR)/*.d)
ifneq ($(DEPS),)
include $(DEPS)
endif
