//@ts-nocheck
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [running, setRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(null);

  const requestRemainingTime = async () => {
    chrome.runtime.sendMessage({ action: "getRemainingTime" }, (response) => {
      if (response.remainingTime) {
        setTimerValue(response.remainingTime);
      }
    });
  };

  useEffect(async () => {
    await requestRemainingTime();
    const port = chrome.runtime.connect({ name: "pomodoroTimer" });

    port.onMessage.addListener((message) => {
      if (message.action === "timerUpdate") {
        setTimerValue(message.timerValue);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const toggleTimer = () => {
    setRunning(!running);
    if (!running) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  const startTimer = () => {
    chrome.runtime.sendMessage({
      action: "start",
      workIntervalMinutes: 25,
      breakIntervalMinutes: 5,
      blockedWebsites: ["*://*.facebook.com/*", "*://*.twitter.com/*"],
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

  return (
    <div className='w-full h-full p-8 flex flex-col items-center justify-center bg-slate-400 text-black'>
      <div className='text-4xl mb-4'>{timerValue}</div>
      <button
        onClick={toggleTimer}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        {running ? "STOP" : "START"}
      </button>
    </div>
  );
}

export default App;
