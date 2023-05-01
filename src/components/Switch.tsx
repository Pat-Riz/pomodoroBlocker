import React, { useState } from "react";
import { MdSettings } from "react-icons/md";

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  onSwitch?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  onSwitch,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleSwitch = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onSwitch) {
      onSwitch(newChecked);
    }
  };

  return (
    <label className='flex items-center cursor-pointer'>
      {label && <span className='mr-3'>{label}</span>}
      <div
        className={`relative w-12 h-3 transition-colors duration-200 ease-in rounded-full ${
          checked ? "bg-blue-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`absolute top-0 w-6 h-6 transform transition-transform duration-200 ease-in rounded-full bg-white shadow-md ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
          onClick={handleSwitch}
        >
          <MdSettings />
          {/* Optional icon can be added here */}
        </div>
      </div>
    </label>
  );
};

export default Switch;
