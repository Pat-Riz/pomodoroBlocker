import React from "react";
import { MdSettings, MdRefresh } from "react-icons/md";
import Container from "./Container";

interface Props {
  timerValue: string;
  running: boolean;
  isFocusTime: boolean;
  toggleTimer(event: React.MouseEvent<HTMLButtonElement>): void;
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
  restartTimer(event: React.MouseEvent<HTMLButtonElement>): void;
}
const Timer = ({
  timerValue,
  running,
  isFocusTime,
  toggleTimer,
  toggleSettings,
  restartTimer,
}: Props) => {
  console.log("Timers timerValue", timerValue);

  const textColor = isFocusTime ? "text-focus-dark" : "text-break-dark";

  return (
    <>
      <Container isFocusTime={isFocusTime}>
        <div className='h-full flex flex-col items-center justify-center'>
          <div
            className={`text-primary ${
              isFocusTime ? "bg-focus" : "bg-break"
            } underline-offset-4 underline tracking-widest font-bold absolute top-4 left-8`}
          >
            PomodoroBlocker
          </div>
          <div className='absolute top-4 right-4 text-3xl  text-primary hover:text-primary-dark '>
            <button className='' onClick={toggleSettings}>
              <MdSettings />
            </button>
          </div>
          <div className='text-6xl font-semibold mb-4'>{timerValue}</div>
          <div className=''>
            <div className='relative'>
              <button
                onClick={toggleTimer}
                className={`bg-primary hover:bg-primary-dark font-bold py-2 px-8 rounded self-center ${textColor}`}
              >
                {running ? "PAUSE" : "START"}
              </button>
              <button
                className='absolute top-2 right-[-24px] text-lg text-primary hover:text-primary-dark'
                onClick={restartTimer}
              >
                <MdRefresh />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Timer;
