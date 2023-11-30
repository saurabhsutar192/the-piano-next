import { Flex, Label, Switch as HoverSwitch } from "@hover-design/react";
import React from "react";
import "./switch.scss";

interface ISwitch {
  label?: string;
  value: boolean;
  setValue: (value: boolean) => void;
  alignItems?: string;
}

const Switch = ({
  alignItems = "flex-start",
  label,
  value,
  setValue,
}: ISwitch) => {
  return (
    <Flex
      className="label-switch"
      flexDirection="column"
      alignItems={alignItems}
      gap="13px"
    >
      {label && <Label htmlFor="label-switch">{label}</Label>}
      <HoverSwitch
        id="label-switch"
        status={value}
        onChange={(value) => setValue(value as boolean)}
      />
    </Flex>
  );
};

export default Switch;
