import React from "react";

interface Props {
  children: React.ReactNode;
  isFocusTime?: boolean;
}

const Container = ({ children, isFocusTime = true }: Props) => {
  return (
    <div
      className={`w-96 h-96 max-w-md p-24 flex flex-col items-center justify-center text-primary relative shadow-lg ${
        isFocusTime ? "bg-focus" : "bg-break"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
