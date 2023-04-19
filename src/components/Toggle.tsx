import React, { useState } from "react";

interface ToggleProps {
  label: string;
  defaultChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const Toggle = ({ label, defaultChecked, onChange }: ToggleProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const toggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className='flex items-center'>
      <label htmlFor='toggle' className='flex items-center cursor-pointer'>
        <div className='relative'>
          <input
            id='toggle'
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={toggle}
          />
          <div
            className={`block ${
              isChecked ? "bg-blue-300" : "bg-gray-600"
            }  w-[60px] h-8 rounded-full`}
          ></div>
          <div
            className={`${
              isChecked ? "translate-x-8" : "translate-x-0"
            } absolute left-0 top-0 bg-blue-500 h-8 w-8 rounded-full shadow-lg transition-all duration-300`}
          ></div>
        </div>
        <div className='ml-3 text-gray-700 font-medium'>{label}</div>
      </label>
    </div>
  );
};

export default Toggle;
