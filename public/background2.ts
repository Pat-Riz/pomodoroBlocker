let timer: NodeJS.Timeout;
let timeRemaining: number;
let isTimerRunning = false;
let isWorkInterval = true;
let connectedPort: chrome.runtime.Port | null = null;
let timeRemainingAfterPause: number | null = null;

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  if (port.name === "pomodoroTimer") {
    connectedPort = port;
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
});

interface StartMessage {
  action: "start";
  workIntervalMinutes: number;
  breakIntervalMinutes: number;
  blockedWebsites: string[];
}

interface StopMessage {
  action: "stop";
}

interface GetRemainingTimeMessage {
  action: "getRemainingTime";
}

type TimerMessage = StartMessage | StopMessage | GetRemainingTimeMessage;

const startTimer = (
  workIntervalMinutes: number,
  breakIntervalMinutes: number
) => {
  isTimerRunning = true;
  isWorkInterval = true;
  timeRemaining = timeRemainingAfterPause
    ? timeRemainingAfterPause
    : workIntervalMinutes * 60;

  timer = setInterval(() => {
    updateTimer(workIntervalMinutes, breakIntervalMinutes);
  }, 1000);
};

chrome.runtime.onMessage.addListener(
  (
    message: TimerMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
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
  }
);

function formatTime(seconds: number): string {
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
