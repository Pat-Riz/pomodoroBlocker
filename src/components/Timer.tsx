import React from "react";
import { MdSettings } from "react-icons/md";
import Container from "./Container";

interface Props {
  timerValue: string;
  running: boolean;
  toggleTimer(event: React.MouseEvent<HTMLButtonElement>): void;
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
}
const Timer = ({ timerValue, running, toggleTimer, toggleSettings }: Props) => {
  return (
    <Container>
      <div className='absolute top-4 right-4 text-4xl'>
        <button className='' onClick={toggleSettings}>
          <MdSettings />
        </button>
      </div>
      <div className='text-6xl mb-4'>{timerValue}</div>
      <button
        onClick={toggleTimer}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        {running ? "PAUSE" : "START"}
      </button>
    </Container>
  );
};

export default Timer;
