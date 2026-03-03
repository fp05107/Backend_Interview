# Faahhhhhh Error 🎵

A playful VS Code extension that *announces* new errors by playing a short **"faah"** sound effect whenever a new diagnostic error appears in your workspace. Turn on the fun and never miss a compilation mistake again!

---

## 🔧 Features

* Monitors diagnostics for all open files.
* Plays an audible **faah** (mp3 or wav) each time **new** errors are added (debounced to avoid spamming).
* Toggle the sound on/off with a command or keybinding.
* Works cross‑platform (Windows/macOS/Linux) using the appropriate native player.

## 📥 Requirements

* The extension ships with `media/faah.mp3` (and a fallback `.wav`).
* On **Windows** no extra dependencies are required.
* On **macOS** the built‑in `afplay` command is used.
* On **Linux** you need either `mpg123`, `mpg321` (for mp3) or `aplay` (for wav) installed.

## ⚙️ Usage

1. Install and enable the extension.
2. Open/modify files until diagnostics report errors.
3. When a new error is detected, you will hear the faah sound.

### Commands

* `Faahhhhhh Error: Toggle` – enable or disable the sound (default keybinding can be added).

## 🛠 Extension Settings

This extension currently has no user‑configurable settings, but the toggle command can be bound in your `keybindings.json`:

```json
{
  "key": "ctrl+alt+f",
  "command": "faahhhhhh-error.toggle"
}
```

## 📝 Known Issues

* Continuous errors on file save may still trigger sounds despite debounce; adjust by opening an issue.
* Linux users must install a sound player manually.

## 📦 Release Notes

### 1.0.0
Initial release – makes a noise when errors appear!

---

## 🗂 More Information

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

Enjoy!
