import { useRef, useEffect } from "react";
import clickSound from "../assets/click_button.mp3";
import timerSound from "../assets/timer_end.mp3";

const useAudio = () => {
  const buttonClicked = useRef<HTMLAudioElement | null>(null);
  const timerEnded = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    buttonClicked.current = new Audio(clickSound);
    timerEnded.current = new Audio(timerSound);
    return () => {
      if (buttonClicked.current) {
        buttonClicked.current.pause();
        buttonClicked.current = null;
      }

      if (timerEnded.current) {
        timerEnded.current.pause();
        timerEnded.current = null;
      }
    };
  }, []);

  const playButtonClickSound = () => {
    if (buttonClicked.current) {
      buttonClicked.current.play();
    }
  };

  const playTimerEndedSound = () => {
    if (timerEnded.current) {
      timerEnded.current.play();
    }
  };

  return { playButtonClickSound, playTimerEndedSound };
};

export default useAudio;
