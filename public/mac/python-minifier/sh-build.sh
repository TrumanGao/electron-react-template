#!/bin/bash
# chmod +x sh-build.sh
if [ -f "main" ]; then
    rm main
fi
pyinstaller main.py -F