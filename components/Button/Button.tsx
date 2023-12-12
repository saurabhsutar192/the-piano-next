import React, { ReactNode } from "react";
import "./button.scss";

type IButton = {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClose?: () => void;
  onClick?: () => void;
} & JSX.IntrinsicElements["button"];

export const Button = ({
  children,
  isActive,
  className,
  onClose,
  onClick,
  ...props
}: IButton) => {
  return (
    <div className={`button ${className}`}>
      <button
        {...props}
        onClick={() => !isActive && onClick && onClick()}
        className={`button-element ${isActive && "active"} `}
      >
        {children}
      </button>
      {isActive && onClose && (
        <button className="close-button" onClick={onClose}>
          x
        </button>
      )}
    </div>
  );
};
