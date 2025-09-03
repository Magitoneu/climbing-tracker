# Climbing Tracker App

A cross-platform mobile app (Expo + React Native + TypeScript) to track your climbing progress, sessions, and visualize your stats.

## Features
- Log boulders by grade, attempts, and session details
- View past sessions
- Visualize progress with charts
- Works on Android, iOS, and Web

## Prerequisites
- Node.js (LTS, installed via nvm recommended)
- pnpm (enabled via corepack)
- Expo CLI (installed automatically by pnpm)
- For mobile: Expo Go app (iOS/Android) or Android Studio for emulator

## Installation
```zsh
# Clone the repo (if not already)
# cd into the project directory
cd /home/crider/projects/ct

# Ensure Node and pnpm are available
. $HOME/.nvm/nvm.sh
node -v
pnpm -v

# Install dependencies
pnpm install
```

## Running the App
### Web (quickest preview)
```zsh
. $HOME/.nvm/nvm.sh
pnpm run web
```
- Open the URL shown (e.g., http://localhost:8081 or 8082) in your browser.
- Use your browser’s responsive design mode to emulate a phone.

### iOS/Android (Expo Go)
1. Install Expo Go from the App Store or Google Play.
2. Ensure your phone and computer are on the same Wi-Fi.
3. Start the dev server:
   ```zsh
   . $HOME/.nvm/nvm.sh
   pnpm run start
   ```
4. Scan the QR code in the terminal with your phone’s camera or Expo Go app.
5. If you have network issues, start with a tunnel:
   ```zsh
   pnpm exec expo start --tunnel
   ```

### Android Emulator
- Install Android Studio and set up a virtual device (AVD).
- With the emulator running, press `a` in the Expo terminal or run:
  ```zsh
  pnpm run android
  ```

## Troubleshooting
- If you see missing dependency errors, run:
  ```zsh
  pnpm exec expo install <package>
  ```
- For network issues, use tunnel mode.
- For more help: https://docs.expo.dev/

## Clean Code & Best Practices
- TypeScript throughout
- Modular folder structure (`src/navigation`, `src/screens`, etc.)
- README kept up to date
- Linting and formatting to be added

---

_Last updated: 2025-09-03_
