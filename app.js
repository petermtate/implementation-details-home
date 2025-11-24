const timeDisplay = document.getElementById("time-display");
const modeIndicator = document.getElementById("mode-indicator");
const progressCircle = document.querySelector(".progress-circle");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");
const skipBtn = document.getElementById("skip-btn");
const sessionCountEl = document.getElementById("session-count");
const nextModeEl = document.getElementById("next-mode");

const focusInput = document.getElementById("focus-mins");
const shortInput = document.getElementById("short-mins");
const longInput = document.getElementById("long-mins");
const longAfterInput = document.getElementById("long-after");
const settingsForm = document.getElementById("settings-form");

const durations = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
  longAfter: 4,
};

const state = {
  mode: "focus",
  remaining: durations.focus,
  total: durations.focus,
  running: false,
  intervalId: null,
  completedFocusSessions: 0,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function minutesToSeconds(minutes) {
  return clamp(Number(minutes) || 1, 1, 90) * 60;
}

function syncDurationsFromInputs() {
  durations.focus = minutesToSeconds(focusInput.value);
  durations.short = minutesToSeconds(shortInput.value);
  durations.long = minutesToSeconds(longInput.value);
  durations.longAfter = clamp(Number(longAfterInput.value) || 4, 2, 10);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getModeLabel(mode) {
  if (mode === "short") return "Short Break";
  if (mode === "long") return "Long Break";
  return "Focus Session";
}

function getModeColor(mode) {
  return mode === "focus" ? "var(--focus)" : "var(--break)";
}

function calculateNextMode(currentMode) {
  if (currentMode === "focus") {
    const isLongBreak =
      state.completedFocusSessions > 0 &&
      state.completedFocusSessions % durations.longAfter === 0;
    return isLongBreak ? "long" : "short";
  }
  return "focus";
}

function previewNextMode() {
  if (state.mode === "focus") {
    const completedIfFinished = state.completedFocusSessions + 1;
    const isLongBreak =
      completedIfFinished > 0 &&
      completedIfFinished % durations.longAfter === 0;
    return isLongBreak ? "long" : "short";
  }
  return "focus";
}

function updateProgressCircle() {
  const elapsed = state.total - state.remaining;
  const fill =
    state.total > 0 ? Math.min(Math.max(elapsed / state.total, 0), 1) : 0;
  const color = getModeColor(state.mode);
  progressCircle.style.background = `conic-gradient(${color} ${
    fill || 0
  }turn, rgba(255,255,255,0.15) ${fill}turn)`;
}

function updateUI() {
  timeDisplay.textContent = formatTime(state.remaining);
  modeIndicator.textContent = getModeLabel(state.mode);
  sessionCountEl.textContent = state.completedFocusSessions;
  nextModeEl.textContent = getModeLabel(previewNextMode());
  startPauseBtn.textContent = state.running
    ? "Pause"
    : state.remaining === state.total
    ? "Start"
    : "Resume";
  updateProgressCircle();
}

function stopTimer() {
  clearInterval(state.intervalId);
  state.intervalId = null;
  state.running = false;
}

function setMode(mode, { keepTime = false } = {}) {
  state.mode = mode;
  if (!keepTime) {
    const nextDuration =
      mode === "focus"
        ? durations.focus
        : mode === "short"
        ? durations.short
        : durations.long;
    state.total = nextDuration;
    state.remaining = nextDuration;
  }
  updateUI();
}

function tick() {
  if (state.remaining <= 0) {
    handleSessionComplete();
    return;
  }

  state.remaining -= 1;
  updateUI();
}

function startTimer() {
  if (state.running) return;
  state.running = true;
  state.intervalId = setInterval(tick, 1000);
  updateUI();
}

function handleSessionComplete() {
  stopTimer();

  if (state.mode === "focus") {
    state.completedFocusSessions += 1;
  }

  const nextMode = calculateNextMode(state.mode);
  setMode(nextMode);
  startTimer();
}

function handleStartPause() {
  if (state.running) {
    stopTimer();
    updateUI();
  } else {
    startTimer();
  }
}

function handleReset() {
  stopTimer();
  syncDurationsFromInputs();
  state.completedFocusSessions = 0;
  state.total = durations.focus;
  state.remaining = durations.focus;
  state.mode = "focus";
  updateUI();
}

function handleSkip() {
  stopTimer();
  if (state.mode === "focus") {
    setMode(calculateNextMode("focus"));
  } else {
    setMode("focus");
  }
}

startPauseBtn.addEventListener("click", handleStartPause);
resetBtn.addEventListener("click", handleReset);
skipBtn.addEventListener("click", handleSkip);

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const wasRunning = state.running;
  syncDurationsFromInputs();
  if (!wasRunning) {
    setMode(state.mode);
  }
  updateUI();
});

syncDurationsFromInputs();
setMode("focus");
