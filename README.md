# 🛡️ NORA TUNNEL

**Secure. Private. Connected.**

Advanced Android Tunnel, VPN & Network Workspace

---

## 📦 APK তৈরি — GitHub Actions (সবচেয়ে সহজ)

### 🔁 Step-by-Step:

```
1. এই repository GitHub-এ push করুন
2. GitHub-এ "Actions" tab-এ যান
3. "Build Nora Tunnel APK" workflow ক্লিক করুন
4. "Run workflow" → "Run workflow" ক্লিক করুন
5. ৩-৫ মিনিট অপেক্ষা করুন
6. Completed run ক্লিক করুন
7. "Artifacts" section-এ scroll করুন
8. nora-tunnel-v1.0.0-debug ডাউনলোড করুন
9. আপনার Android ফোনে transfer করুন
10. Install করুন! 📱
```

### 🔄 Auto Build:
- `main` branch-এ push করলে automatically APK build হয়
- `main` branch-এ push হলে **GitHub Release** ও তৈরি হয় APK সহ

### 🔨 Build Process:
```
npm ci                    → Install dependencies
npm run build             → Build web app (Vite)
npx cap add android       → Create Android project (Capacitor)
npx cap copy/sync android → Copy web → Android
patch-android.sh          → Add VPN perms, dark theme, SDK 34
./gradlew assembleDebug   → Build APK
```

---

## 💻 Local Build (Android Studio/SDK লাগবে)

### Prerequisites:
- Node.js 20+
- Java 17 (Zulu/JDK)
- Android SDK with API 34

### Quick Build:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

### Manual Build:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
bash scripts/patch-android.sh
cd android && ./gradlew assembleDebug
# APK → android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 App Features

| Feature | Status |
|---------|--------|
| 🛡️ Multi-protocol UI (WireGuard, VLESS, VMess, Trojan, etc.) | ✅ UI Complete |
| 📋 Profile management (Create, Edit, Delete, Import) | ✅ UI Complete |
| 🧭 Routing Studio (Global/Proxy/Rule-based) | ✅ UI Complete |
| 🔬 Network Lab (Ping, DNS, TCP, TLS, HTTP) | ✅ UI Complete |
| 📊 Live Dashboard (Speed, Latency, Uptime) | ✅ UI Complete |
| 🔒 Security Center | ✅ UI Complete |
| 📝 Log Center (Secret Redaction) | ✅ UI Complete |
| ⚙️ Settings | ✅ UI Complete |
| 📦 APK via GitHub Actions | ✅ Ready |
| 🔌 Real VPN/Tunnel Cores | ⚠️ Requires native integration |

---

## ⚠️ Notes

- **UI**: Fully interactive, all screens working
- **Connection**: Honest state machine — shows "Core not available" instead of fake "Connected"
- **APK**: Builds as a Capacitor Android app wrapping the web UI
- **Real VPN**: Requires integrating native cores (WireGuard Go, Xray, sing-box, OpenVPN3) as Android library modules

---

## 📄 License

Private — All rights reserved.
