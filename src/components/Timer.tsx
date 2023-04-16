import React from "react";
import { MdSettings, MdRefresh } from "react-icons/md";
import Container from "./Container";

interface Props {
  timerValue: string;
  running: boolean;
  toggleTimer(event: React.MouseEvent<HTMLButtonElement>): void;
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
  restartTimer(event: React.MouseEvent<HTMLButtonElement>): void;
}
const Timer = ({
  timerValue,
  running,
  toggleTimer,
  toggleSettings,
  restartTimer,
}: Props) => {
  console.log("Timers timerValue", timerValue);

  return (
    <Container>
      <div className='absolute top-4 right-4 text-4xl'>
        <button className='' onClick={toggleSettings}>
          <MdSettings />
        </button>
      </div>
      <div className='text-6xl mb-4'>{timerValue}</div>
      {/* <div className=''> */}
      <div className='relative'>
        <button
          onClick={toggleTimer}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center'
        >
          {running ? "PAUSE" : "START"}
        </button>
        <button
          className='absolute top-3 right-[-28px] text-black'
          onClick={restartTimer}
        >
          <MdRefresh />
        </button>
      </div>
      {/* </div> */}
    </Container>
  );
};

export default Timer;
