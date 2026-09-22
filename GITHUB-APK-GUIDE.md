# Saiful Othman Trading Apps — GitHub APK Build

This repository is prepared for a phone-only APK build using GitHub Actions.

## Build from an Android phone

1. Create a GitHub repository.
2. Upload all files in this project to the repository.
3. Open the repository on GitHub.
4. Go to **Actions**.
5. Select **Build Android APK**.
6. Tap **Run workflow**.
7. Wait for the workflow to finish.
8. Open the completed workflow run.
9. Under **Artifacts**, download:
   `saiful-othman-trading-app-debug-apk`
10. Extract the downloaded artifact and install the `.apk` on your Android phone.

## Automatic builds

The workflow also runs when you push to `main` or `master`.

## Notes

- This workflow builds a debug APK, suitable for testing and sideloading.
- A Play Store release requires a signing key and a release build configuration.
- The workflow first builds the web app when a suitable `package.json` is present, then copies the generated `dist` directory into the Android app assets before running Gradle.
