import React, { useState } from "react";

interface Props {
  value: string;
  error: string;
  handleChange(): void;
}

const NumberInput = ({ value, error, handleChange }: Props) => {
  return (
    <div className='w-full max-w-xs mx-auto'>
      <label
        className='block text-gray-700 text-sm font-bold mb-1'
        htmlFor='number-input'
      >
        Focus time
      </label>
      <input
        className='shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        id='number-input'
        type='number'
        placeholder='Focus time'
        value={value}
        onChange={handleChange}
      />
      {error && <p className='text-red-500 text-xs italic mt-1'>{error}</p>}
    </div>
  );
};

export default NumberInput;
