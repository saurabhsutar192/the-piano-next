import React, { ReactNode } from "react";
import "./button.scss";
import { Loader } from "@hover-design/react";
import variables from "@/theme/colors.module.scss";

type IButton = {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  isLoading?: boolean;
} & JSX.IntrinsicElements["button"];

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
              color={variables.accentColorDark}
              dashLength={50}
              height={"10px"}
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
