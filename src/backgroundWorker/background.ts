let timer;
let timeRemaining;
let isTimerRunning = false;
let isWorkInterval = true;
let connectedPort = null;
let timeRemainingAfterPause = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "pomodoroTimer") {
    connectedPort = port;
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
});

function startTimer(workIntervalMinutes, breakIntervalMinutes) {
  isTimerRunning = true;
  isWorkInterval = true;
  timeRemaining = timeRemainingAfterPause
    ? timeRemainingAfterPause
    : workIntervalMinutes * 60; // Work interval in seconds

  timer = setInterval(() => {
    updateTimer(workIntervalMinutes, breakIntervalMinutes);
  }, 1000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    if (!isTimerRunning) {
      startTimer(message.workIntervalMinutes, message.breakIntervalMinutes);
      updateBlockedWebsites(message.blockedWebsites);
      timeRemainingAfterPause = null;
    }
  } else if (message.action === "stop") {
    if (isTimerRunning) {
      clearInterval(timer);
      isTimerRunning = false;
      timeRemainingAfterPause = timeRemaining;
      chrome.action.setBadgeText({ text: "" });
    }
  } else if (message.action === "getRemainingTime") {
    sendResponse({ remainingTime });
  }
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function updateTimer() {
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

    if (connectedPort) {
      connectedPort.postMessage({
        action: "timerUpdate",
        timerValue: formatTime(timeRemaining),
      });
    }
  } else {
    clearInterval(timer);
    isWorkInterval = !isWorkInterval;
    timeRemaining = isWorkInterval
      ? workIntervalMinutes * 60
      : breakIntervalMinutes * 60;

    timer = setInterval(() => {
      updateTimer(workIntervalMinutes, breakIntervalMinutes);
    }, 1000);
  }
}

function updateBlockedWebsites(blockedWebsites) {
  const newRules = blockedWebsites.map((website, index) => {
    const uniqueId = `${website.replace(/[^a-zA-Z0-9]/g, "")}_${index + 1}`;

    return {
      id: uniqueId,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: ".*",
        domains: [website],
        resourceTypes: ["main_frame"],
      },
    };
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [],
    addRules: newRules,
  });
}
