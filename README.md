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
- For mobile:
  - Expo Go app (iOS/Android)
  - Android Studio for Android emulator
  - **Mac only:** Xcode for iOS simulator

## Installation
```zsh
# Clone the repo (if not already)
git clone https://github.com/Magitoneu/climbing-tracker.git
cd climbing-tracker

# On Mac, you can use zsh or bash
source ~/.zshrc  # or ~/.bash_profile if using bash
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
  pnpm run start
  ```
4. Scan the QR code in the terminal with your phone’s camera or Expo Go app.
5. If you have network issues, start with a tunnel:
  ```zsh
  pnpm exec expo start --tunnel
  ```

### iOS Simulator (Mac only)
1. Install Xcode from the Mac App Store.
2. Open Xcode and install Command Line Tools if prompted.
3. Start the Expo dev server:
  ```zsh
  pnpm run start
  ```
4. In the Expo terminal, press `i` to launch the iOS simulator.
  - If you see errors, ensure Xcode is installed and open at least once.

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
- For iOS simulator issues, ensure Xcode is installed and updated.
- For more help: https://docs.expo.dev/


## Logging a Climbing Session

1. Go to the **Log** tab in the app.
2. Enter the session date, select your grade system (V-Scale or Font), and fill in the number of boulders sent and attempts for each grade you climbed.
3. Optionally, add session duration and notes.
4. Tap **Save Session**. Your session will be stored in memory (not persisted) and available for this session only.

> **Note:** Data is not persisted between reloads. To enable persistence, a future update will add a web-compatible storage solution.

## Clean Code & Best Practices
- TypeScript throughout
- Modular folder structure (`src/navigation`, `src/screens`, etc.)
- README kept up to date
- Linting and formatting to be added
- Cross-platform: works on Mac, Linux, Windows (web, iOS, Android)

---

_Last updated: 2025-09-03_

# TODO add custom grading, for gyms with colors, etc. 
# TODO have a home page, it is wierd to land on log.
