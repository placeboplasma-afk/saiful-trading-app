#!/usr/bin/env bash
set -euo pipefail
# Run this script after placing the original React project at ../saifulapp.
ROOT="$(cd "$(dirname "$0")" && pwd)"
WEB="$ROOT/../saifulapp"
if [ ! -f "$WEB/package.json" ]; then echo "Original web project not found at $WEB"; exit 1; fi
cd "$WEB"
npm install
npm run build
rm -rf "$ROOT/app/src/main/assets/www"/*
cp -R dist/* "$ROOT/app/src/main/assets/www/"
echo "Web assets copied to Android assets. Open $ROOT in Android Studio and build the APK."
