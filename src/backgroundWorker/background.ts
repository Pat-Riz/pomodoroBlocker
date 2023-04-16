import { TimerMessage } from "../types";

let timer: number;
let timeRemaining: number;
let isTimerRunning = false;
let isWorkInterval = true;
let connectedPort: chrome.runtime.Port | null = null;
let timeRemainingAfterPause: number | null = null;
let focusTime: number = 0.2;
let breakTime: number = 5;
let blockedSites: string[] = ["reddit.com"];

const stopTimer = () => {
  clearInterval(timer);
  isTimerRunning = false;
  chrome.action.setBadgeText({ text: "" });
  updateRules();
};

const restartTimer = () => {
  stopTimer();
  timeRemainingAfterPause = null;
  timeRemaining = isWorkInterval ? focusTime * 60 : breakTime * 60;
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "pomodoroTimer") {
    connectedPort = port;
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
});

chrome.runtime.onMessage.addListener(
  (message: TimerMessage, sender, sendResponse) => {
    console.log("--> Message recived: ", message);

    switch (message.action) {
      case "start":
        console.log("Running start");
        console.log("Timer running:", isTimerRunning);

        if (!isTimerRunning) {
          startTimer();
          timeRemainingAfterPause = null;
        }
        break;
      case "stop":
        if (isTimerRunning) {
          stopTimer();
          timeRemainingAfterPause = timeRemaining;
        }
        break;
      case "restart":
        if (isTimerRunning) {
          restartTimer();
        }
        break;
      case "getCurrentStatus":
        sendResponse({
          timeRemaining: timeRemaining
            ? formatTime(timeRemaining)
            : `${focusTime}:00`,
          isTimerRunning,
          focusTime,
          breakTime,
          blockedSites,
        });
        break;
      case "updateSettings":
        focusTime = message.focusTime;
        breakTime = message.breakTime;
        updateBlockedSites(message.blockedSites);
        restartTimer();
        break;
    }
  }
);

function startTimer() {
  console.log("Starting timmer");

  isTimerRunning = true;
  isWorkInterval = true;
  timeRemaining = timeRemainingAfterPause
    ? timeRemainingAfterPause
    : focusTime * 60; // Work interval in seconds

  timer = setInterval(() => {
    updateTimer(focusTime, breakTime);
  }, 1000);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function updateTimer(focusTime: number, breakTime: number) {
  if (timeRemaining > 0) {
    console.log("Timer ticking....", timeRemaining);

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

    if (connectedPort) {
      console.log("Sending timer", timeRemaining);

      connectedPort.postMessage({
        action: "timerUpdate",
        timerValue: formatTime(timeRemaining),
        isTimerRunning,
      });
    }
  } else {
    //TODO: Refactor to use reset/stopTimer?
    clearInterval(timer);
    isWorkInterval = !isWorkInterval;
    isTimerRunning = false;
    timeRemaining = isWorkInterval ? focusTime * 60 : breakTime * 60;

    // TODO: If Auto start break. Do this
    // timer = setInterval(() => {
    //   updateTimer(focusTime, breakTime);
    // }, 1000);

    if (connectedPort) {
      console.log("Sending timer", timeRemaining);

      connectedPort.postMessage({
        action: "timerUpdate",
        timerValue: formatTime(timeRemaining),
        isTimerRunning,
      });
    }
  }
}

async function updateBlockedSites(blockedSites: string[]) {
  blockedSites = blockedSites;

  const newRules = blockedSites.map((website, index) => {
    return {
      id: index + 1, // Rule ID must be >= 1
      priority: 1,
      action: {
        type: "block" as chrome.declarativeNetRequest.RuleActionType,
      },
      condition: {
        urlFilter: `||${website}`,
        resourceTypes: [
          "main_frame",
          "sub_frame",
        ] as chrome.declarativeNetRequest.ResourceType[],
      },
    };
  });
  updateRules(newRules);
}

async function updateRules(newRules?: chrome.declarativeNetRequest.Rule[]) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const idsToDelete = oldRules.map((rule) => {
    return rule.id;
  });
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules,
    removeRuleIds: idsToDelete,
  });
}

export {};
