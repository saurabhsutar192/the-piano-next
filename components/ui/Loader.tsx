import React from "react";
import "./loader.scss";

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 40, className }: LoaderProps) => {
  return (
    <svg
      className={`loader ${className || ""}`}
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className="loader-track"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
      <circle
        className="loader-spinner"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeLinecap="round"
      />
    </svg>
  );
};
