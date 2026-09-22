# Saiful Othman Trading Apps — Android Studio WebView wrapper

This project wraps the supplied React/Vite PWA in a native Android WebView.

## Build the APK
1. Open this folder in Android Studio.
2. Let Gradle sync and install the Android SDK requested by the project if prompted.
3. Build > Build Bundle(s) / APK(s) > Build APK(s).
4. APK output: `app/build/outputs/apk/debug/app-debug.apk`.

## Bundle the supplied React app
The original web source is included under `web-src/` and `web-public/`. On a machine with Node.js:

```bash
cd web-src/..   # use the original project folder if preferred
npm install
npm run build
```

Then copy the generated Vite `dist/` contents into:

`app/src/main/assets/www/`

The Android wrapper will load `app/src/main/assets/www/index.html` locally.

### Important
The supplied project uses Vite/React and may require its environment variables (see `.env.example`) for AI/API functionality. Do not embed private API keys in the Android APK. Prefer a server-side proxy for production secrets.
