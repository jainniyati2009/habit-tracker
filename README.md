# Habitly 🔥 — Daily Habit Tracker

A feature-rich, gamified daily habit tracker built with **pure HTML, CSS & JavaScript**. No frameworks, no build tools — just open and go!

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎨 Theming & Customization
- **10 color accent themes** — Indigo, Rose, Emerald, Amber, Sky, Violet, Pink, Teal, Orange, Cyan
- **Dark / Light mode** — toggle or auto-detect system preference
- All accent themes work seamlessly in both modes

### 🎮 Gamification
- **XP & Leveling** — earn XP for check-ins, streaks, and perfect days
- **20 Achievements** — unlock badges like "Week Warrior", "Night Owl", "Diamond Discipline"
- **Achievement popup** with glow animation and sound effects
- **Level-up celebrations** with confetti burst

### 📋 Habit Management
- **Create, edit, delete, and archive** habits
- **Priority levels** — High 🔴, Medium 🟡, Low 🟢
- **6 categories** — Health, Mind, Productivity, Social, Creative, Other
- **10 color options** per habit
- **Personal notes** — attach motivational notes
- **16 pre-built templates** — quick-add popular habits (Workout, Meditate, Read, etc.)
- **Drag & drop reordering**

### 🔍 Search, Filter & Sort
- **Search bar** — find habits instantly
- **Category filter chips** — filter by category
- **Sort** — by Name, Streak, Completion, Priority, or Custom order

### 📊 Stats Dashboard
- **8 overview stat cards** — habits, today %, week %, best streak, check-ins, perfect days, level, badges
- **30-day completion bars** — per-habit progress
- **8-week trend chart** — canvas-drawn line chart with gradient fill
- **90-day activity heatmap** — GitHub-style per-habit grid

### ✨ Extra Features
- **Onboarding wizard** — 3-step welcome flow for new users
- **Motivational quotes** — 20 rotating quotes
- **Progress ring** — circular SVG showing today's completion
- **Sound effects** — Web Audio API chimes (toggleable)
- **Confetti celebration** — on perfect days and level-ups
- **Data export/import** — JSON backup & restore
- **Keyboard shortcuts** — `N` new, `T` today, `D` dark mode, `←→` weeks, `1-4` tabs
- **Fully responsive** — works great on mobile and desktop
- **LocalStorage persistence** — all data stored locally in your browser

## 🚀 Getting Started

### Option 1: Open directly
Just open `index.html` in your browser — no server needed!

### Option 2: Local server
```bash
# Using Python
python -m http.server 3000

# Or using Node.js
npx serve .
```
Then visit `http://localhost:3000`

## 📁 Project Structure

```
habit-tracker/
├── index.html    # Main HTML structure
├── style.css     # Complete styling with theme system
├── app.js        # All application logic
└── README.md     # This file
```

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, `<dialog>` elements
- **CSS3** — Custom properties, CSS Grid, Flexbox, animations, media queries
- **Vanilla JavaScript** — ES6+, LocalStorage, Canvas API, Web Audio API

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New habit |
| `T` | Go to today |
| `D` | Toggle dark mode |
| `←` | Previous week |
| `→` | Next week |
| `1-4` | Switch tabs |

## 📸 Screenshots

> Open `index.html` in your browser to explore the app!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
