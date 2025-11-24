# Pomodoro Timer

This is a single-page Pomodoro application written in vanilla HTML, CSS, and JavaScript. It helps enforce focused work sessions with structured breaks that follow the Pomodoro technique.

## Features

- 25/5/15 minute focus, short-break, and long-break defaults with inline controls to adjust durations.
- Conic-gradient progress ring and mode labels to clearly show the current session state.
- `Start/Pause`, `Reset`, and `Skip` controls to manage the timer without reloading the page.
- Automatic cycling from focus → short break → focus and so on, with every `N`th break upgraded to a long break (default 4 focus sessions).
- Real-time stats showing completed focus sessions and what mode comes next.

## Code Structure

- `index.html` – static markup defining the layout: hero section, timer card (progress indicator, controls, stats), and settings card (form inputs).
- `style.css` – theme variables, responsive grid layout, frosted-glass card styling, and the animated progress circle using CSS conic gradients.
- `app.js`
  - Maintains a single `state` object (mode, remaining time, total duration, running flag, completed sessions).
  - Stores user-configurable durations and syncs them with the settings form inputs.
  - Updates the UI every second: formats time, updates progress ring fill, toggles button labels.
  - Handles transitions between modes, deciding when to trigger short or long breaks based on the completed focus count.

## Running the App

Open `index.html` directly in any modern browser. No build tooling or dependencies are required. All logic and styling are loaded via `style.css` and `app.js`. While the timer runs entirely on the client, leave the browser tab active so interval callbacks continue firing on schedule.

