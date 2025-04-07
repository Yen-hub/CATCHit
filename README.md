# CATCHit

A threat intelligence tool that scans incoming traffic for indicators of compromise and reports every threats and security levels.

## 🖥️ Desktop Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Tauri](https://tauri.app/) (Rust-based, lightweight desktop app framework)
- **State Management**: Redux Toolkit

---

## 📦 Getting Started

Follow these instructions to clone, install, and run the app locally as a desktop application.

### 1. Prerequisites

Make sure you have the following installed:

- **Node.js** (v18+): https://nodejs.org/
- **Rust** (Stable): https://www.rust-lang.org/tools/install
  > After installing Rust, run `rustup update` to ensure you're on the latest stable version.
- A C++ build environment (for Tauri):
  - **Windows**: Install [Microsoft Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) with the "Desktop development with C++" workload
- **Tauri CLI**:  
  Install globally via:
  ```bash
  npm install -g @tauri-apps/cli
  ```

### 2. Clone the Repository

```bash
git clone https://github.com/Yen-hub/CATCHit.git
cd CATCHit
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run in Development Mode (Hot Reload)

This will start the Vite frontend and Tauri backend with live reloading:

```bash
npm run tauri dev
```

## 📦 Building the Desktop App

To build a production-ready version of the app for your OS:

```bash
npm run tauri build
```

After building, you will find the compiled app in the src-tauri/target/release/bundle directory.
