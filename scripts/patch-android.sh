#!/bin/bash
# ============================================================
# NORA TUNNEL — Patch Capacitor Android Project
# Adds VPN permissions, custom theme, network security
# ============================================================

set -e

MANIFEST="android/app/src/main/AndroidManifest.xml"
STRINGS="android/app/src/main/res/values/strings.xml"
STYLES="android/app/src/main/res/values/styles.xml"

echo "🔧 Patching Capacitor Android project..."

# Check if android project exists
if [ ! -d "android" ]; then
    echo "❌ android/ directory not found. Run 'npx cap add android' first."
    exit 1
fi

# ---- 1. Patch AndroidManifest.xml ----
if [ -f "$MANIFEST" ]; then
    echo "  📝 Patching AndroidManifest.xml..."

    # Add VPN permissions before <application tag
    if ! grep -q "FOREGROUND_SERVICE" "$MANIFEST"; then
        sed -i 's|<application|<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />\n    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n    <application|' "$MANIFEST"
    fi

    # Add networkSecurityConfig to application tag
    if ! grep -q "networkSecurityConfig" "$MANIFEST"; then
        sed -i 's|android:usesCleartextTraffic="true"|android:usesCleartextTraffic="false"\n        android:networkSecurityConfig="@xml/network_security_config"|' "$MANIFEST"
    fi

    echo "  ✅ Manifest patched"
else
    echo "  ⚠️  Manifest not found at $MANIFEST"
fi

# ---- 2. Patch strings.xml ----
if [ -f "$STRINGS" ]; then
    echo "  📝 Patching strings.xml..."
    sed -i 's|<string name="app_name">.*</string>|<string name="app_name">NORA TUNNEL</string>|' "$STRINGS"
    sed -i 's|<string name="title_activity_main">.*</string>|<string name="title_activity_main">NORA TUNNEL</string>|' "$STRINGS"
    echo "  ✅ Strings patched"
fi

# ---- 3. Patch styles.xml for dark theme ----
if [ -f "$STYLES" ]; then
    echo "  📝 Patching styles.xml..."
    # Replace windowBackground with our dark color
    sed -i 's|android:windowBackground">.*</item>|android:windowBackground">#06061a</item>|g' "$STYLES"
    # Add navigation and status bar colors
    if ! grep -q "navigationBarColor" "$STYLES"; then
        sed -i '/android:windowBackground/a\        <item name="android:navigationBarColor">#06061a</item>\n        <item name="android:statusBarColor">#06061a</item>' "$STYLES"
    fi
    echo "  ✅ Styles patched"
fi

# ---- 4. Add network_security_config.xml ----
SECURITY_DIR="android/app/src/main/res/xml"
mkdir -p "$SECURITY_DIR"

cat > "$SECURITY_DIR/network_security_config.xml" << 'XMLEOF'
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
XMLEOF

echo "  ✅ Network security config added"

# ---- 5. Patch build.gradle for SDK 34 + Java 17 ----
APP_BUILD="android/app/build.gradle"
if [ -f "$APP_BUILD" ]; then
    echo "  📝 Patching app/build.gradle..."
    # Update compileSdk
    sed -i 's|compileSdk .*|compileSdk 34|' "$APP_BUILD"
    # Update minSdk
    sed -i 's|minSdk .*|minSdk 29|' "$APP_BUILD"
    # Update targetSdk
    sed -i 's|targetSdk .*|targetSdk 34|' "$APP_BUILD"
    # Update Java version
    sed -i 's|sourceCompatibility .*|sourceCompatibility JavaVersion.VERSION_17|' "$APP_BUILD"
    sed -i 's|targetCompatibility .*|targetCompatibility JavaVersion.VERSION_17|' "$APP_BUILD"
    echo "  ✅ Build.gradle patched"
fi

ROOT_BUILD="android/build.gradle"
if [ -f "$ROOT_BUILD" ]; then
    echo "  📝 Patching root build.gradle..."
    # Update AGP version
    sed -i 's|com.android.tools.build:gradle:.*|com.android.tools.build:gradle:8.2.2"|' "$ROOT_BUILD"
    echo "  ✅ Root build.gradle patched"
fi

# ---- 6. Patch gradle.properties ----
GRADLE_PROPS="android/gradle.properties"
if [ -f "$GRADLE_PROPS" ]; then
    echo "  📝 Patching gradle.properties..."
    if ! grep -q "android.useAndroidX" "$GRADLE_PROPS"; then
        echo "android.useAndroidX=true" >> "$GRADLE_PROPS"
    fi
    echo "  ✅ Gradle properties patched"
fi

# ---- 7. Patch gradle-wrapper.properties ----
WRAPPER_PROPS="android/gradle/wrapper/gradle-wrapper.properties"
if [ -f "$WRAPPER_PROPS" ]; then
    echo "  📝 Patching gradle-wrapper.properties..."
    sed -i 's|distributionUrl=.*|distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-all.zip|' "$WRAPPER_PROPS"
    echo "  ✅ Gradle wrapper patched"
fi

echo ""
echo "✅ Android project patched successfully!"
echo ""
