#!/bin/sh
# Builds bundle/app.js (the file the TV shell downloads) from the libraries and src/app.js.
set -e
cd "$(dirname "$0")/.."
{
  echo "/* Hearth bundle – built by tools/build.sh. Edit src/app.js, not this file. */"
  echo "(function () {"
  cat lib/paho-mqtt.min.js
  echo ""
  echo "}).call(window);"
  cat lib/qrcode.js
  echo ""
  cat src/app.js
} > bundle/app.js
node -e "new Function(require('fs').readFileSync('bundle/app.js','utf8'));console.log('bundle/app.js ok,', require('fs').statSync('bundle/app.js').size, 'bytes')"
