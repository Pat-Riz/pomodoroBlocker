import React from "react";

interface Props {
  children: React.ReactNode;
  isFocusTime?: boolean;
}

const Container = ({ children, isFocusTime = true }: Props) => {
  const bgColor = isFocusTime
    ? "bg-gradient-to-br from-focus from-30% to-focus-dark"
    : "bg-gradient-to-br from-break from-30% to-break-dark ";
  return (
    <div
      className={`w-96 h-96 max-w-md p-24 flex flex-col items-center justify-center text-primary relative shadow-lg ${bgColor} 
      border-2 border-black`}
    >
      {children}
    </div>
  );
};

export default Container;
