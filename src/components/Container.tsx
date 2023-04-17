import React from "react";

interface Props {
  children: React.ReactNode;
  isFocusTime?: boolean;
}

const Container = ({ children, isFocusTime = true }: Props) => {
  console.log("Container FOCUSTIME", isFocusTime);

  return (
    <div
      className={`w-full h-full max-w-md p-24 flex flex-col items-center justify-center text-primary relative shadow-lg ${
        isFocusTime ? "bg-focus" : "bg-break"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
