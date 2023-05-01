import React, { ChangeEvent } from "react";

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  name: string;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ id, label, checked, name, onChange }: CheckboxProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className='flex items-center space-x-2'>
      <input
        id={id}
        type='checkbox'
        name={name}
        className='w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer'
        checked={checked}
        onChange={handleOnChange}
      />
      <label htmlFor={id} className='text-sm cursor-pointer'>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
