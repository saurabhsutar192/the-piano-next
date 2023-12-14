import { INote } from "@/types/global.types";
import React, { useMemo } from "react";
import "./key.styles.scss";

interface IKeyProps {
  isEmpty?: boolean;
  playedNotes: INote[];
  showLabel: boolean;
  label: string;
  keyType?: "white" | "black";
}

const Key = ({
  isEmpty = false,
  playedNotes,
  showLabel,
  label,
  keyType = "white",
}: IKeyProps) => {
  const isPressed = useMemo(
    () => playedNotes.find(({ note }) => note === label.split(" ").join("")),
    [playedNotes, label]
  );

  return (
    <div className={`key ${keyType} ${isEmpty && "is-empty"} `}>
      <span className={`note ${isPressed && "pressed"}`}>
        {showLabel ? label : ""}
      </span>
    </div>
  );
};

export default Key;
