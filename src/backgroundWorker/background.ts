let timer: number;
let timeRemaining: number;
let isTimerRunning = false;
let isWorkInterval = true;
let connectedPort: chrome.runtime.Port | null = null;
let timeRemainingAfterPause: number | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "pomodoroTimer") {
    connectedPort = port;
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    if (!isTimerRunning) {
      console.log("Starting timer -->", message);

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
    sendResponse({
      timeRemaining: timeRemaining ? formatTime(timeRemaining) : -1,
      isTimerRunning,
    });
  }
});

function startTimer(workIntervalMinutes: number, breakIntervalMinutes: number) {
  isTimerRunning = true;
  isWorkInterval = true;
  timeRemaining = timeRemainingAfterPause
    ? timeRemainingAfterPause
    : workIntervalMinutes * 60; // Work interval in seconds

  timer = setInterval(() => {
    updateTimer(workIntervalMinutes, breakIntervalMinutes);
  }, 1000);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function updateTimer(
  workIntervalMinutes: number,
  breakIntervalMinutes: number
) {
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

function updateBlockedWebsites(blockedWebsites: string[]) {
  const newRules = blockedWebsites.map((website, index) => {
    //Can probally refactor this, saw an example where we can declare that we auto remove old ID if we add same ID.
    const uniqueId = `${website.replace(/[^a-zA-Z0-9]/g, "")}_${index + 1}`;
    const hashedId = hashCode(uniqueId);
    return {
      id: index + 1,
      priority: 1,
      action: { type: "block" as chrome.declarativeNetRequest.RuleActionType },
      condition: {
        urlFilter: ".*",
        domainSuffix: website,
        // domains: [website],

        resourceTypes: [
          "main_frame",
        ] as chrome.declarativeNetRequest.ResourceType[],
      },
    };
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules,
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
