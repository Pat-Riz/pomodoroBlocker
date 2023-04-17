import React, { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
}

const Label = ({ label, ...rest }: Props) => {
  return (
    <label className='text-primary text-sm  mb-2' {...rest}>
      {label}
    </label>
  );
};

export default Label;
