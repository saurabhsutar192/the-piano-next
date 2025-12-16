import { Flex, Label } from "@/components/ui";
import React from "react";
import "./switch.scss";

interface ISwitch {
  label?: string;
  value: boolean;
  setValue: (value: boolean) => void;
  alignItems?: "flex-start" | "center" | "flex-end";
  isDisabled?: boolean;
}

const Switch = ({
  alignItems = "flex-start",
  label,
  value,
  setValue,
  isDisabled = false,
}: ISwitch) => {
  const handleToggle = () => {
    if (!isDisabled) {
      setValue(!value);
    }
  };

  return (
    <Flex
      className="label-switch"
      flexDirection="column"
      alignItems={alignItems}
      gap="13px"
    >
      {label && <Label htmlFor="label-switch">{label}</Label>}
      <input
        type="checkbox"
        id="label-switch"
        checked={value}
        onChange={handleToggle}
        disabled={isDisabled}
        style={{ display: "none" }}
      />
      <span
        role="switch"
        tabIndex={0}
        aria-checked={value}
        aria-label={label || "Toggle switch"}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`switch-track ${value ? "checked" : ""} ${isDisabled ? "disabled" : ""}`}
      >
        <span className="switch-thumb" />
      </span>
    </Flex>
  );
};

export default Switch;
