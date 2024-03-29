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
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [isFocusTime, setIsFocusTime] = useState<boolean>(true);
  const [autoPlayBreaks, setAutoPlayBreaks] = useState(false);
  const [autoPlayFocus, setAutoPlayFocus] = useState(false);
  const [volume, setVolume] = useState(3);

  const { playButtonClickSound } = useAudio();

  const setTimerToFocusTime = (newFocusTime: number) => {
    const timer = `${newFocusTime}:00`;
    setTimerValue(timer); //default
  };

  const fetchCurrentStatus = async () => {
    chrome.runtime.sendMessage<TimerMessage, GetCurrentStatusResponse>(
      { action: "getCurrentStatus", target: "timer" },
      (response) => {
        setFocusTime(response.focusTime);
        setBreakTime(response.breakTime);
        setBlockedSites(response.blockedSites);
        setRunning(response.isTimerRunning);
        setAutoPlayBreaks(response.autoPlayBreaks);
        setAutoPlayFocus(response.autoPlayFocus);
        setVolume(response.volume);

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
      target: "timer",
    });
  };

  const restartTimer = () => {
    setTimerToFocusTime(focusTime);
    setRunning(false);
    setIsFocusTime(true);
    chrome.runtime.sendMessage<TimerMessage>({
      action: "restart",
      target: "timer",
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage<TimerMessage>({
      action: "stop",
      target: "timer",
    });
  };

  const saveChanges = (
    focusTime: number,
    breakTime: number,
    blockedSites: string[],
    autoFocus: boolean,
    autoBreak: boolean,
    volume: number
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
    setVolume(volume);
    chrome.runtime.sendMessage<TimerMessage>({
      action: "updateSettings",
      target: "timer",
      focusTime,
      breakTime,
      blockedSites,
      autoPlayFocus: autoFocus,
      autoPlayBreaks: autoBreak,
      volume,
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
          volume={volume}
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
