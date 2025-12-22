import React, { CSSProperties, ReactNode } from "react";

interface FlexProps {
  children?: ReactNode;
  className?: string;
  flexDirection?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: string;
  flexWrap?: CSSProperties["flexWrap"];
  style?: CSSProperties;
}

export const Flex = ({
  children,
  className,
  flexDirection = "row",
  alignItems,
  justifyContent,
  gap,
  flexWrap,
  style,
}: FlexProps) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        flexWrap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
