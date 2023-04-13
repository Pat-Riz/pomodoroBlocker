import React, { useState } from "react";
import { MdSettings } from "react-icons/md";
import Container from "./Container";
import NumberInput from "./NumberInput";

interface Props {
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
  focusTime: number;
  breakTime: number;
  saveChanges(
    focusTime: number,
    breakTime: number,
    blockedWebsites: string[]
  ): void;
}

const Settings = ({
  toggleSettings,
  focusTime,
  breakTime,
  saveChanges,
}: Props) => {
  const [focusTimeState, setFocusTimeState] = useState(focusTime);
  const [breakTimeState, setBreakTimeState] = useState(breakTime);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   console.log("CHANGE", e.target.name);

  //   setFocusTimeState(Number(value));

  //   if (value === "" || isNaN(Number(value))) {
  //     setErrorMessage("Please enter a valid number.");
  //   } else {
  //     setErrorMessage("");
  //   }
  // };

  const updateFocus = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFocusTimeState(Number(e.target.value));

  const updateBreak = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBreakTimeState(Number(e.target.value));

  return (
    <div className='w-full h-full max-w-lg p-24 flex flex-col items-center bg-slate-400 text-black'>
      <div className='flex gap-4 mb-4'>
        <NumberInput
          value={focusTimeState}
          name='focusTime'
          label='Focus time'
          error=''
          handleChange={updateFocus}
        />
        <NumberInput
          value={breakTimeState}
          name='breakTime'
          label='Break time'
          error=''
          handleChange={updateBreak}
        />
      </div>
      <label htmlFor='' className='block text-gray-700 text-sm font-bold mb-1'>
        Blocked sites
      </label>
      <textarea className='w-full h-32 resize-none mb-4' />
      <div className='flex gap-4'>
        <button
          className='bg-blue-500 hover:bg-blue-600 hover:shadow-md hover:scale-105 px-2 py-1 rounded'
          onClick={() =>
            saveChanges(focusTimeState, breakTimeState, ["Test", "Test2"])
          }
        >
          Save
        </button>
        <button
          className='border border-blue-500 hover:shadow-md hover:scale-105 px-2 py-1 rounded'
          onClick={toggleSettings}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
