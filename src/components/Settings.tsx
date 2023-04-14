import React, { KeyboardEventHandler, useState } from "react";
import { MdSettings } from "react-icons/md";
import Container from "./Container";
import NumberInput from "./NumberInput";
import Label from "./Label";

interface Props {
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
  focusTime: number;
  breakTime: number;
  blockedSites: string[];
  saveChanges(
    focusTime: number,
    breakTime: number,
    blockedSites: string[]
  ): void;
}

const Settings = ({
  toggleSettings,
  focusTime,
  breakTime,
  blockedSites,
  saveChanges,
}: Props) => {
  const [focusTimeState, setFocusTimeState] = useState(focusTime);
  const [breakTimeState, setBreakTimeState] = useState(breakTime);
  const [blockedSiteState, setBlockedSitesState] =
    useState<string[]>(blockedSites);
  const [newBlockedSite, setNewBlockedSite] = useState("");
  // const [formData, setFormData] = useState({
  //   focusTimeState: "",
  //   breakTimeState: "",
  //   blockedSiteState: [],
  // });

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };

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

  const updateSite = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewBlockedSite(e.target.value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setBlockedSitesState([...blockedSiteState, newBlockedSite]);
    }
  };

  return (
    <div className='w-full h-full max-w-lg p-12 flex flex-col items-center bg-slate-400 text-black'>
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
      <Label htmlFor='blockedSites' label='Blocked sites' />
      <input
        type='text'
        onKeyDown={handleKeyPress}
        onChange={updateSite}
        value={newBlockedSite}
        placeholder='Enter website to block'
      />
      <div className='flex gap-2 my-2 flex-wrap'>
        {blockedSiteState.map((site, index) => {
          return (
            <>
              <div className='text-white bg-blue-800 rounded pl-2'>
                {site}
                <button
                  onClick={() => {
                    setNewBlockedSite(".");
                    setBlockedSitesState(
                      blockedSiteState.filter(
                        (currSite, currIndex) => index !== currIndex
                      )
                    );
                  }}
                  className='mx-2'
                >
                  X
                </button>
              </div>
            </>
          );
        })}
      </div>
      <div className='flex gap-4'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() =>
            saveChanges(focusTimeState, breakTimeState, blockedSiteState)
          }
        >
          Save
        </button>
        <button
          className='hover:underline px-2 py-1 rounded text-white font-bold'
          onClick={toggleSettings}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
