import React, { useState } from "react";
import Label from "./Label";

interface SliderProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ value, onChange }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <label htmlFor={"volume"} className='text-sm cursor-pointer'>
        Volume
      </label>
      <div className='flex flex-col items-center w-full p-2 relative'>
        <input
          type='range'
          min='1'
          max='5'
          value={value}
          onChange={onChange}
          className='w-full h-1 bg-gray-300 outline-none appearance-none rounded'
          style={{
            background: `linear-gradient(to right, #4299e1 0%, #4299e1 ${
              (value - 1) * 25
            }%, #edf2f7 ${(value - 1) * 25}%)`,
          }}
          onMouseDown={() => setIsHovering(true)}
          onMouseUp={() => setIsHovering(false)}
          onMouseLeave={() => setIsHovering(false)}
          name='volume'
        />
        {isHovering && (
          <div
            className='absolute top-0 left-0 -translate-y-full  rounded-full bg-primary text-focus-dark px-2'
            style={{ marginLeft: `${(value - 1) * 22}%` }}
          >
            {value}
          </div>
        )}
      </div>
    </>
  );
};

export default Slider;
