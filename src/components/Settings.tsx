import React from "react";
import { MdSettings } from "react-icons/md";
import Container from "./Container";
import NumberInput from "./NumberInput";

interface Props {
  toggleSettings(event: React.MouseEvent<HTMLButtonElement>): void;
}

const Settings = ({ toggleSettings }: Props) => {
  return (
    <Container>
      <div className='w-full max-w-xs mx-auto'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Number
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='number-input'
          type='number'
          placeholder='Enter a number'
        />
        <p className='text-red-500 text-xs italic mt-2'>
          Please enter a valid number.
        </p>
      </div>
      <NumberInput />
      <div className='flex gap-4'>
        <button className='bg-stone-200 hover:bg-slate-300 px-2 py-1 rounded'>
          Save
        </button>
        <button className='' onClick={toggleSettings}>
          Cancel
        </button>
      </div>
    </Container>
  );
};

export default Settings;
