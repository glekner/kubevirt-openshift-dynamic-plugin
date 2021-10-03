#!/usr/bin/env bash

set -u

git submodule update --init console
if [ ! -d console/frontend/public/dist ]; then (cd console ; ./build.sh); fi
