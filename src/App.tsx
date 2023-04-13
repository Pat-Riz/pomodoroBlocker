import { useEffect, useState } from "react";
import Settings from "./components/Settings";
import Timer from "./components/Timer";

import "./index.css";
import { GetCurrentStatusResponse, TimerMessage } from "./types";

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [timerValue, setTimerValue] = useState<string>("25:00");
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [blockedSites, setBlockedSites] = useState<string[]>([
    "www.reddit.com",
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  console.log("Default values", focusTime, breakTime, blockedSites);

  const setTimerToFocusTime = (newFocusTime: number) => {
    const timer = `${newFocusTime}:00`;
    setTimerValue(timer); //default
  };

  const fetchCurrentStatus = async () => {
    chrome.runtime.sendMessage<TimerMessage, GetCurrentStatusResponse>(
      { action: "getCurrentStatus" },
      (response) => {
        console.log("DATA RECIVED: ", response);

        setFocusTime(response.focusTime);
        setBreakTime(response.breakTime);
        setBlockedSites(response.blockedSites);
        setRunning(response.isTimerRunning);

        if (response.timeRemaining && Number(response.timeRemaining) >= 0) {
          setTimerValue(String(response.timeRemaining));
        } else {
          setTimerToFocusTime(response.focusTime);
        }
      }
    );
  };

  useEffect(() => {
    fetchCurrentStatus();
    const port = chrome.runtime.connect({ name: "pomodoroTimer" });

    port.onMessage.addListener((message) => {
      if (message.action === "timerUpdate") {
        console.log("Timer update recived");

        setTimerValue(message.timerValue);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

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
    chrome.runtime.sendMessage<TimerMessage>({
      action: "start",
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage<TimerMessage>({
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
    blockedSites: string[]
  ) => {
    setFocusTime(focusTime);
    setBreakTime(breakTime);
    setBlockedSites(blockedSites);
    setShowSettings(false);
    setTimerToFocusTime(focusTime);
    chrome.runtime.sendMessage<TimerMessage>({
      action: "updateSettings",
      focusTime,
      breakTime,
      blockedSites,
    });
  };

  console.log(
    "Values before rendining",
    focusTime,
    breakTime,
    blockedSites,
    timerValue
  );
  return (
    <>
      {showSettings ? (
        <Settings
          toggleSettings={toggleSettings}
          focusTime={focusTime}
          breakTime={breakTime}
          saveChanges={saveChanges}
          blockedSites={blockedSites}
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
