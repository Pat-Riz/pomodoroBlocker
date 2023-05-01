import React, { useState } from "react";
import BlockedSitesTags from "./BlockedSitesTags";
import Container from "./Container";
import ErrorText from "./ErrorText";
import Label from "./Label";
import NumberInput from "./NumberInput";
import Toggle from "./Toggle";
interface Props {
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
  focusTime: number;
  breakTime: number;
  blockedSites: string[];
  isFocusTime: boolean;
  autoFocus: boolean;
  autoBreak: boolean;
  saveChanges(
    focusTime: number,
    breakTime: number,
    blockedSites: string[],
    autoFocus: boolean,
    autoBreak: boolean
  ): void;
}

const urlWithoutProtocolRegex =
  /^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#]\S*)?$/;

const Settings = ({
  toggleSettings,
  focusTime,
  breakTime,
  blockedSites,
  isFocusTime,
  saveChanges,
  autoBreak,
  autoFocus,
}: Props) => {
  const [focusTimeState, setFocusTimeState] = useState(focusTime);
  const [breakTimeState, setBreakTimeState] = useState(breakTime);
  const [blockedSiteState, setBlockedSitesState] =
    useState<string[]>(blockedSites);
  const [newBlockedSite, setNewBlockedSite] = useState("");
  const [autoPlayBreaksState, setAutoPlayBreaksState] = useState(autoBreak);
  const [autoPlayFocusState, setAutoPlayFocusState] = useState(autoFocus);
  const [urlError, setUrlError] = useState("");

  const updateFocus = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFocusTimeState(Number(e.target.value));

  const updateBreak = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBreakTimeState(Number(e.target.value));

  const updateSite = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewBlockedSite(e.target.value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (urlWithoutProtocolRegex.test(newBlockedSite)) {
        setBlockedSitesState([...blockedSiteState, newBlockedSite]);
        setNewBlockedSite("");
        setUrlError("");
      } else {
        setUrlError("Invalid url");
      }
    }
  };

  const handleTagDelete = (index: number) => {
    setBlockedSitesState(
      blockedSiteState.filter((currSite, currIndex) => index !== currIndex)
    );
  };

  const validateAndSave = async () => {
    try {
      // await schema.validate({ focusTime, breakTime });
      saveChanges(
        focusTimeState,
        breakTimeState,
        blockedSiteState,
        autoPlayFocusState,
        autoPlayBreaksState
      );
    } catch (err) {
      // input is invalid
      //@ts-ignore
      console.error(err.errors);
    }
  };

  return (
    <Container isFocusTime={isFocusTime}>
      <div className='m-4 flex flex-col items-center'>
        <h2 className='self-start text-bold text-lg'>Settings</h2>
        <div className='flex gap-4 mb-2 '>
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
        <div className=' flex flex-col my-2 gap-3'>
          <Toggle
            label='Auto Start Pomodoros'
            id='autoFocusToggle'
            defaultChecked={autoPlayFocusState}
            onChange={(checked: boolean) => setAutoPlayFocusState(checked)}
          />
          <Toggle
            label='Auto Start Breaks'
            id='autoBreakToggle'
            defaultChecked={autoPlayBreaksState}
            onChange={(checked: boolean) => setAutoPlayBreaksState(checked)}
          />
        </div>
        <div className='flex flex-col w-52 items-start'>
          <Label htmlFor='blockedSites' label='Block website' />
        </div>
        <input
          type='text'
          className='shadow appearance-none border rounded h-10 w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          onKeyDown={handleKeyPress}
          onChange={updateSite}
          value={newBlockedSite}
          placeholder='Press enter to add'
        />

        {urlError && <ErrorText error={urlError} />}
        <BlockedSitesTags
          blockedSites={blockedSiteState}
          handleTagDelete={handleTagDelete}
        />

        <div className='self-center justify-end flex gap-4 m-2'>
          <button
            className='bg-primary hover:bg-primary-dark text-focus-dark font-bold py-2 px-4 rounded'
            onClick={() => validateAndSave()}
          >
            Save
          </button>
          <button
            className='hover:underline px-2 py-1 rounded text-primary font-bold'
            onClick={toggleSettings}
          >
            Cancel
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
