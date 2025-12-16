import React, { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
}

export const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {children}
    </label>
  );
};
