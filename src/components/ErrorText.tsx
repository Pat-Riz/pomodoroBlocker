import React from "react";

interface Props {
  error?: string;
}

const ErrorText = ({ error }: Props) => {
  return <p className='text-red-500 text-xs italic mt-1'>{error}</p>;
};

export default ErrorText;
