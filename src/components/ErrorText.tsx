import React from "react";

interface Props {
  error?: string;
}

const ErrorText = ({ error }: Props) => {
  return (
    <div className='bg-red-700 inline-block py-1 px-2 '>
      <p className='text-sm italic tracking-wider '>{error}</p>
    </div>
  );
};

export default ErrorText;
