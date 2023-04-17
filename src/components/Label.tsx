import React, { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
}

const Label = ({ label, ...rest }: Props) => {
  return (
    <label className='block text-primary text-sm font-bold mb-1' {...rest}>
      {label}
    </label>
  );
};

export default Label;
