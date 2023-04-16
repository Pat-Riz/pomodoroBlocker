import React from "react";

interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return (
    <div className='w-full h-full max-w-md p-24 flex flex-col items-center justify-center bg-slate-400 text-black relative rounded-lg shadow-lg'>
      {children}
    </div>
  );
};

export default Container;
