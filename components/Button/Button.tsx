import React, { ReactNode, ButtonHTMLAttributes } from "react";
import "./button.scss";
import { Loader } from "@/components/ui";

type IButton = {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  isActive,
  className,
  onClose,
  onClick,
  isLoading = false,
  ...props
}: IButton) => {
  return (
    <div className={`button ${className}`}>
      <button
        type="button"
        {...props}
        onClick={() => !isActive && onClick && onClick()}
        className={`button-element ${isActive && "active"} `}
      >
        {children}{" "}
        {isLoading && (
          <span>
            <Loader
              size={20}
            />
          </span>
        )}
      </button>
      {isActive && onClose && (
        <button className="close-button" onClick={onClose} type="button">
          x
        </button>
      )}
    </div>
  );
};
