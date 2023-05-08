import { TimerMessage } from "../types";
import { updateBlockedSites, getBlockedSites } from "./blockedSites";
import {
  getCurrentStatus,
  restartTimer,
  startTimer,
  stopTimer,
  updateSettings,
} from "./timer";

let connectedPort: chrome.runtime.Port | null = null;

const handleConnectedPort = (port: chrome.runtime.Port) => {
  if (port.name === "pomodoroTimer") {
    connectedPort = port;
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
};

export const sendMessageToPort = (message: any) => {
  if (connectedPort) {
    connectedPort.postMessage(message);
  }
};

const handleMessage = (
  message: TimerMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message.target === "offscreen") {
    return false;
  }

  switch (message.action) {
    case "start":
      startTimer();
      break;
    case "stop":
      stopTimer();
      break;
    case "restart":
      restartTimer();
      break;
    case "updateSettings":
      updateSettings(
        message.focusTime,
        message.breakTime,
        message.autoPlayFocus,
        message.autoPlayBreaks
      );
      updateBlockedSites(message.blockedSites);
      break;
    case "getCurrentStatus":
      sendResponse({ ...getCurrentStatus(), blockedSites: getBlockedSites() });
      break;
  }
};

export const setupMessageHandler = () => {
  chrome.runtime.onConnect.addListener(handleConnectedPort);
  chrome.runtime.onMessage.addListener(handleMessage);
};
