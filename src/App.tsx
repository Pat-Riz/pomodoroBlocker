import { useEffect, useState } from "react";
import Settings from "./components/Settings";
import Timer from "./components/Timer";
import useAudio from "./hooks/useAudio";
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
  const [isFocusTime, setIsFocusTime] = useState<boolean>(true);
  const [autoPlayBreaks, setAutoPlayBreaks] = useState(false);
  const [autoPlayFocus, setAutoPlayFocus] = useState(false);

  const { playButtonClickSound } = useAudio();
  //THIS NEEDS TO BE DONE IN BACKGROUND SCRIPT.
  // BECAUSE IF EXTENSION IS NOT OPEN NO SOUND IS PLAYED

  const setTimerToFocusTime = (newFocusTime: number) => {
    const timer = `${newFocusTime}:00`;
    setTimerValue(timer); //default
  };

  const fetchCurrentStatus = async () => {
    chrome.runtime.sendMessage<TimerMessage, GetCurrentStatusResponse>(
      { action: "getCurrentStatus" },
      (response) => {
        setFocusTime(response.focusTime);
        setBreakTime(response.breakTime);
        setBlockedSites(response.blockedSites);
        setRunning(response.isTimerRunning);

        if (response.timeRemaining) {
          setTimerValue(String(response.timeRemaining));
        } else {
          setTimerToFocusTime(response.focusTime);
        }
      }
    );
  };

  if (!import.meta.env.DEV) {
    //In Dev we cant access chrome.runtime. So it fails.
    useEffect(() => {
      fetchCurrentStatus();
      const port = chrome.runtime.connect({ name: "pomodoroTimer" });

      port.onMessage.addListener((message) => {
        if (message.action === "timerUpdate") {
          setTimerValue(message.timerValue);
          setRunning(message.isTimerRunning);
          setIsFocusTime(message.isFocusTime);

          if (message.timerValue === "00:00") {
            //playTimerEndedSound();
          }
        }
      });

      return () => {
        port.disconnect();
      };
    }, []);
  }

  const toggleTimer = (event: React.MouseEvent<HTMLButtonElement>) => {
    playButtonClickSound();
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

  const restartTimer = () => {
    setTimerToFocusTime(focusTime);
    setRunning(false);
    setIsFocusTime(true);
    chrome.runtime.sendMessage<TimerMessage>({
      action: "restart",
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage<TimerMessage>({
      action: "stop",
    });
  };

  const saveChanges = (
    focusTime: number,
    breakTime: number,
    blockedSites: string[],
    autoFocus: boolean,
    autoBreak: boolean
  ) => {
    setFocusTime(focusTime);
    setBreakTime(breakTime);
    setBlockedSites(blockedSites);
    setShowSettings(false);
    setTimerToFocusTime(focusTime);
    setRunning(false);
    setIsFocusTime(true);
    setAutoPlayBreaks(autoBreak);
    setAutoPlayFocus(autoFocus);
    chrome.runtime.sendMessage<TimerMessage>({
      action: "updateSettings",
      focusTime,
      breakTime,
      blockedSites,
      autoPlayFocus,
      autoPlayBreaks,
    });
  };
  return (
    <>
      {showSettings ? (
        <Settings
          toggleSettings={toggleSettings}
          focusTime={focusTime}
          breakTime={breakTime}
          autoFocus={autoPlayFocus}
          autoBreak={autoPlayBreaks}
          saveChanges={saveChanges}
          blockedSites={blockedSites}
          isFocusTime={isFocusTime}
        />
      ) : (
        <Timer
          timerValue={timerValue}
          running={running}
          toggleTimer={toggleTimer}
          toggleSettings={toggleSettings}
          restartTimer={restartTimer}
          isFocusTime={isFocusTime}
          isRunning={running}
        />
      )}
    </>
  );
}

export default App;
