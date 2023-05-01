import React, { useState } from "react";

interface ToggleProps {
  label: string;
  defaultChecked: boolean;
  id: string;
  onChange: (isChecked: boolean) => void;
}

const Toggle = ({ label, defaultChecked, id, onChange }: ToggleProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const toggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className='flex items-center'>
      <label htmlFor={id} className='flex items-center cursor-pointer'>
        <div className='relative'>
          <input
            id={id}
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={toggle}
          />
          <div
            className={`block transition-all duration-300 ${
              isChecked ? "bg-blue-400" : "bg-gray-400"
            }  w-9 h-4 rounded-full`}
          ></div>
          <div
            className={`${
              isChecked ? "translate-x-6" : "translate-x-1"
            } absolute left-[-5px] top-[-1px]  h-5 w-5 rounded-full shadow-lg transition-all duration-300 ${
              isChecked ? "bg-blue-700" : "bg-gray-300"
            }`}
          ></div>
        </div>

        <div className='ml-2 text-primary text-sm '>{label}</div>
      </label>
    </div>
  );
};

export default Toggle;
