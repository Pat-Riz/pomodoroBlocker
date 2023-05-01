import React from "react";

interface Props {
  children: React.ReactNode;
  isFocusTime?: boolean;
}

const Container = ({ children, isFocusTime = true }: Props) => {
  const bgColor = isFocusTime
    ? "bg-gradient-to-br from-focus from-30% to-focus-dark"
    : "bg-gradient-to-br from-break from-30% to-break-dark ";
  const borderColor = isFocusTime ? "border-focus-dark" : "border-break-dark";
  return (
    <div
      className={`w-[26rem] h-[26rem] text-primary relative shadow-lg ${bgColor} 
      border-2 ${borderColor}`}
    >
      {children}
    </div>
  );
};

export default Container;
