# SPDX-License-Identifier: GPL-2.0+
# Copyright (c) 2021 Joël Porquet-Lupine and Garrett Hagopian

# Define `all` rule right away
all: build-book


###
# Configuration

# Lupbook directory
abs_lbdir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# Binaries
PANDOC ?= pandoc
FILTERS = pandoc/lupbook.py pandoc/toc_filter.py

abs_filters = $(realpath $(FILTERS))

# Source paths
SRC_DIR ?= sample
SRC_LBVM ?= lupbookvm.js
CONF ?= $(SRC_DIR)/config.mk

abs_conf := $(realpath $(CONF))
include $(abs_conf)

# Build paths
BUILD_DIR ?= build
BUILD_NAME ?= book.html

abs_build = $(realpath $(BUILD_DIR))

###
# Rules

build-dir: FORCE
	@mkdir -p $(BUILD_DIR)
	rm -f $(BUILD_DIR)/header-include.html

$(BUILD_DIR)/header-include.html: FORCE

build-book: build-dir $(MODULE_DEPS)
	cp $(SRC_LBVM) $(abs_build)/lupbookvm.js
	cd $(SRC_DIR) && \
        $(PANDOC) -o $(abs_build)/$(BUILD_NAME) \
            -V lbdir=$(abs_lbdir) \
            --embed-resources --standalone \
            --section-divs \
            --template template.html *.md \
            $(patsubst %,--filter %,$(abs_filters))

# External Resources
deps: build-codemirror build-xtermjs build-xtermjs-addon-fit

build-codemirror:
	cd ext/codemirror && npm install

build-xtermjs:
	cd ext/xtermjs && npm install && npm run package

build-xtermjs-addon-fit:
	cd ext/xtermjs/addons/xterm-addon-fit/ && npm run package

# Clean
clean: FORCE
	rm -rf $(BUILD_DIR)

# Phony rules
FORCE:
.PHONY: FORCE
