import { useRef, useEffect } from "react";
import clickSound from "../assets/click_button.mp3";
import timerSound from "../assets/timer_end.mp3";

const clearRef = (ref: React.MutableRefObject<HTMLAudioElement | null>) => {
  if (ref.current) {
    ref.current.pause();
    ref.current = null;
  }
};

const useAudio = () => {
  const buttonClicked = useRef<HTMLAudioElement | null>(null);
  const timerEnded = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    buttonClicked.current = new Audio(clickSound);
    timerEnded.current = new Audio(timerSound);
    return () => {
      clearRef(buttonClicked);
      clearRef(timerEnded);
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
