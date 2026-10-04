#!/bin/bash
# ============================================================
# NORA TUNNEL — Local APK Build Script
# ============================================================

set -e

echo ""
echo "🛡️  NORA TUNNEL — APK Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Node.js
if command -v node &> /dev/null; then
    echo "  ✅ Node.js: $(node --version)"
else
    echo "  ❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# Java
if command -v java &> /dev/null; then
    echo "  ✅ Java: $(java -version 2>&1 | head -1)"
else
    echo "  ❌ Java 17 not found. Install from https://adoptium.net"
    exit 1
fi

# Android SDK
if [ -n "$ANDROID_HOME" ]; then
    echo "  ✅ Android SDK: $ANDROID_HOME"
elif [ -d "$HOME/Android/Sdk" ]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
    echo "  ✅ Android SDK: $ANDROID_HOME"
else
    echo "  ⚠️  ANDROID_HOME not set."
    echo "     Install Android Studio or SDK from https://developer.android.com/studio"
    echo "     Then: export ANDROID_HOME=\$HOME/Android/Sdk"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🌐 Building web app..."
npm run build

echo ""
echo "📱 Setting up Capacitor Android..."
if [ -d "android" ]; then
    echo "  Android platform exists — syncing..."
    npx cap sync android
    npx cap copy android
else
    echo "  Adding Android platform..."
    npx cap add android
    npx cap copy android
    npx cap sync android
fi

echo ""
echo "🔧 Patching Android project..."
chmod +x scripts/patch-android.sh
bash scripts/patch-android.sh

echo ""
echo "🔨 Building APK..."
cd android
chmod +x gradlew 2>/dev/null || true

BUILD_TYPE="${1:-debug}"

if [ "$BUILD_TYPE" = "release" ]; then
    echo "  Building RELEASE APK..."
    ./gradlew assembleRelease --no-daemon
    APK="app/build/outputs/apk/release/app-release-unsigned.apk"
else
    echo "  Building DEBUG APK..."
    ./gradlew assembleDebug --no-daemon
    APK="app/build/outputs/apk/debug/app-debug.apk"
fi

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "android/$APK" ]; then
    SIZE=$(du -h "android/$APK" | cut -f1)
    echo "✅ APK Build Complete!"
    echo ""
    echo "📱 APK: android/$APK"
    echo "📊 Size: $SIZE"
    echo ""
    echo "📲 Install:"
    echo "  1. Transfer APK to your Android device"
    echo "  2. Enable 'Install from unknown sources'"
    echo "  3. Install the APK"
else
    echo "❌ APK build failed!"
    echo "Check the error output above."
    exit 1
fi

echo ""
