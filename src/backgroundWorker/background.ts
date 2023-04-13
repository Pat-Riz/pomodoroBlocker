import { TimerMessage } from "../types";

let timer: number;
let timeRemaining: number;
let isTimerRunning = false;
let isWorkInterval = true;
let connectedPort: chrome.runtime.Port | null = null;
let timeRemainingAfterPause: number | null = null;
let focusTime: number = 25;
let breakTime: number = 5;
let blockedSites: string[] = ["reddit.com"];

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
          clearInterval(timer);
          isTimerRunning = false;
          timeRemainingAfterPause = timeRemaining;
          chrome.action.setBadgeText({ text: "" });
          updateRules();
        }
        break;
      case "getCurrentStatus":
        sendResponse({
          timeRemaining: timeRemaining ? formatTime(timeRemaining) : -1,
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
      });
    }
  } else {
    clearInterval(timer);
    isWorkInterval = !isWorkInterval;
    timeRemaining = isWorkInterval ? focusTime * 60 : breakTime * 60;

    timer = setInterval(() => {
      updateTimer(focusTime, breakTime);
    }, 1000);
  }
}

async function updateBlockedSites(blockedSites: string[]) {
  blockedSites = blockedSites;

  const newRules = blockedSites.map((website, index) => {
    //Can probally refactor this, saw an example where we can declare that we auto remove old ID if we add same ID.
    const uniqueId = `${website.replace(/[^a-zA-Z0-9]/g, "")}_${index + 1}`;
    const hashedId = hashCode(uniqueId);
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

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export {};
