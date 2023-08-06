import { OffscreenMessage } from "../types";
import { updateRules } from "./blockedSites";
import { sendMessageToPort } from "./messageHandler";
import { playAudioInOffscreenDocument } from "./offscreen";

let timer: number;
let timeRemaining: number;
let isTimerRunning = false;
let isFocusTime = true;
let timeRemainingAfterPause: number | null = null;
let focusTime: number = 25;
let breakTime: number = 5;
let autoPlayFocus: boolean = false;
let autoPlayBreaks: boolean = false;
let volume: number = 3;

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
      : (isFocusTime ? focusTime : breakTime) * 60; // Work interval in seconds

    timer = setInterval(() => {
      updateTimer(focusTime, breakTime);
    }, 1000);
  }
};

export const stopTimer = () => {
  updateRules();
  clearInterval(timer);
  isTimerRunning = false;
  chrome.action.setBadgeText({ text: "" });
};

export const restartTimer = () => {
  stopTimer();
  isFocusTime = true;
  timeRemainingAfterPause = null;
  timeRemaining = isFocusTime ? focusTime * 60 : breakTime * 60;
};

const updateTimer = async (focusTime: number, breakTime: number) => {
  if (timeRemaining > 0) {
    timeRemaining -= 1;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const badgeText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({
      color: isFocusTime ? "#487a99" : "#e69a38",
    });

    sendMessageToPort({
      action: "timerUpdate",
      timerValue: formatTime(timeRemaining),
      isTimerRunning,
      isFocusTime,
    });
  } else {
    if (isFocusTime && autoPlayBreaks) {
      console.log("Auto play breaks");
    } else if (!isFocusTime && autoPlayFocus) {
      console.log("Auto play focus");
    } else {
      console.log("Timer stopped");
      clearInterval(timer);
      isTimerRunning = false;
      updateRules();
    }

    isFocusTime = !isFocusTime;
    timeRemaining = isFocusTime ? focusTime * 60 : breakTime * 60;

    sendMessageToPort({
      action: "timerUpdate",
      timerValue: formatTime(timeRemaining),
      isTimerRunning,
      isFocusTime,
    });

    //Volume in settings is 1-5. Volume in chrome is 0,1 - 1.0.
    let chromeVolume = (volume * 2) / 10;
    if (volume === 1) {
      chromeVolume = 0.1;
    }
    await playAudioInOffscreenDocument("timer_end.mp3", chromeVolume);
  }
};

export const updateSettings = (
  newFocusTime: number,
  newBreakTime: number,
  autoFocus: boolean,
  autoBreaks: boolean,
  newVolume: number
) => {
  focusTime = newFocusTime;
  breakTime = newBreakTime;
  autoPlayFocus = autoFocus;
  autoPlayBreaks = autoBreaks;
  volume = newVolume;
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
    isFocusTime,
    autoPlayFocus,
    autoPlayBreaks,
    volume,
  };
};
