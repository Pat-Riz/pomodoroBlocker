import { useEffect, useState } from "react";
import Settings from "./components/Settings";
import Timer from "./components/Timer";

import "./index.css";

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [timerValue, setTimerValue] = useState<string>("25:00");
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");

  // const requestRemainingTime = async () => {
  //   chrome.runtime.sendMessage({ action: "getRemainingTime" }, (response) => {
  //     if (response.timeRemaining && response.timeRemaining >= 0) {
  //       setTimerValue(response.timeRemaining);
  //     }
  //     setRunning(response.isTimerRunning);
  //   });
  // };

  // useEffect(() => {
  //   requestRemainingTime();
  //   const port = chrome.runtime.connect({ name: "pomodoroTimer" });

  //   port.onMessage.addListener((message) => {
  //     if (message.action === "timerUpdate") {
  //       setTimerValue(message.timerValue);
  //     }
  //   });

  //   return () => {
  //     port.disconnect();
  //   };
  // }, []);

  const toggleTimer = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRunning(!running);
    if (!running) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  const toggleSettings = (event: React.MouseEvent<HTMLButtonElement>) =>
    setShowSettings(!showSettings);

  const startTimer = () => {
    chrome.runtime.sendMessage({
      action: "start",
      workIntervalMinutes: 25,
      breakIntervalMinutes: 5,
      blockedWebsites: ["*://*.facebook.com/*"],
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage({
      action: "stop",
    });
  };

  const playSound = () => {
    // const audio = new Audio("path/to/sound-file.mp3");
    // audio.play();
    // alert("DING DING DING");
  };

  const saveChanges = (
    focusTime: number,
    breakTime: number,
    blockedWebsites: string[]
  ) => {
    setFocusTime(focusTime);
    setBreakTime(breakTime);
    chrome.runtime.sendMessage({
      action: "updateBlockedSites",
      blockedWebsites,
    });
  };

  return (
    <>
      {showSettings ? (
        <Settings
          toggleSettings={toggleSettings}
          focusTime={focusTime}
          breakTime={breakTime}
          saveChanges={saveChanges}
        />
      ) : (
        <Timer
          timerValue={timerValue}
          running={running}
          toggleTimer={toggleTimer}
          toggleSettings={toggleSettings}
        />
      )}
    </>
  );
}

export default App;
