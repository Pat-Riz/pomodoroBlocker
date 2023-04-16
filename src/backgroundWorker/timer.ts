import { sendMessageToPort } from "./messageHandler";

let timer: number;
let timeRemaining: number;
let isTimerRunning = false;
let isWorkInterval = true;
let timeRemainingAfterPause: number | null = null;
let focusTime: number = 0.2;
let breakTime: number = 5;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export const startTimer = () => {
  if (!isTimerRunning) {
    isTimerRunning = true;
    timeRemaining = timeRemainingAfterPause
      ? timeRemainingAfterPause
      : (isWorkInterval ? focusTime : breakTime) * 60; // Work interval in seconds

    timer = setInterval(() => {
      updateTimer(focusTime, breakTime);
    }, 1000);
  }
};

export const stopTimer = () => {
  clearInterval(timer);
  isTimerRunning = false;
  chrome.action.setBadgeText({ text: "" });
};

export const restartTimer = () => {
  stopTimer();
  isWorkInterval = true;
  timeRemainingAfterPause = null;
  timeRemaining = isWorkInterval ? focusTime * 60 : breakTime * 60;
};

const updateTimer = (focusTime: number, breakTime: number) => {
  if (timeRemaining > 0) {
    timeRemaining -= 1;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const badgeText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({
      color: isWorkInterval ? "#3b82f6" : "#6b7280",
    });

    sendMessageToPort({
      action: "timerUpdate",
      timerValue: formatTime(timeRemaining),
      isTimerRunning,
    });
  } else {
    clearInterval(timer);
    isWorkInterval = !isWorkInterval;
    isTimerRunning = false;
    timeRemaining = isWorkInterval ? focusTime * 60 : breakTime * 60;
    sendMessageToPort({
      action: "timerUpdate",
      timerValue: formatTime(timeRemaining),
      isTimerRunning,
    });

    // TODO: If Auto start break. Do this
    // timer = setInterval(() => {
    //   updateTimer(focusTime, breakTime);
    // }, 1000);
  }
};

export const updateSettings = (newFocusTime: number, newBreakTime: number) => {
  focusTime = newFocusTime;
  breakTime = newBreakTime;
  restartTimer();
};

export const getCurrentStatus = () => {
  return {
    timeRemaining: timeRemaining
      ? formatTime(timeRemaining)
      : `${focusTime}:00`,
    isTimerRunning,
    focusTime,
    breakTime,
  };
};
