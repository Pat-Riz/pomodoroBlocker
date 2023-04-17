import React, { useState } from "react";
import BlockedSitesTags from "./BlockedSitesTags";
import Label from "./Label";
import NumberInput from "./NumberInput";
import ErrorText from "./ErrorText";
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

const urlWithoutProtocolRegex =
  /^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#]\S*)?$/;

// const urlWithoutProtocol = yup
//   .string()
//   .matches(urlWithoutProtocolRegex, "Invalid URL")
//   .required("Required");
// const positiveNumber = yup
//   .number()
//   .integer("Number must be an integer")
//   .min(1, "Number must be at least 1")
//   .max(60, "Number cannot be greater than 60")
//   .required("Number is required");

// const schema = yup.object().shape({
//   focusTime: positiveNumber,
//   breakTime: positiveNumber,
// });

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
  const [urlError, setUrlError] = useState("");
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
      saveChanges(focusTimeState, breakTimeState, blockedSiteState);
    } catch (err) {
      // input is invalid
      //@ts-ignore
      console.error(err.errors);
    }
  };

  return (
    <div className='w-full h-full max-w-lg p-12 flex flex-col items-center bg-focus'>
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
      <Label htmlFor='blockedSites' label='Block website' />
      <input
        type='text'
        className='w-52 mb-1'
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
      <div className='flex gap-4 mt-2'>
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
  );
};

export default Settings;
