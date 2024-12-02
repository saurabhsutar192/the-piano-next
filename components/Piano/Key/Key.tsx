import { INote } from "@/types/global.types";
import React, { useMemo } from "react";
import "./key.styles.scss";

interface IKeyProps {
  isEmpty?: boolean;
  playedNotes: INote[];
  showLabel: boolean;
  label: string;
  keyType?: "white" | "black";
  handleNotePlay: (note: string, velocity?: number) => void;
  handleNoteLift: (note: string) => void;
  isClicked: boolean;
  setIsClicked: (value: boolean) => void;
}

const Key = ({
  isEmpty = false,
  playedNotes,
  showLabel,
  label,
  keyType = "white",
  handleNoteLift,
  handleNotePlay,
  isClicked,
  setIsClicked,
}: IKeyProps) => {
  const keyName = label.split(" ").join("");

  const isPressed = useMemo(
    () => playedNotes.find(({ note }) => note === keyName),
    [playedNotes, label]
  );

  const handleKeyClick = () => {
    setIsClicked(true);
    handleNotePlay(keyName);
  };

  const handleKeyLeave = () => {
    setIsClicked(false);
    handleNoteLift(keyName);
  };

  const handleMouseEnter = () => {
    isClicked && handleNotePlay(keyName);
  };

  const handleMouseLeave = () => {
    isClicked && handleNoteLift(keyName);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    handleKeyClick();
  };
  const handleTouchEnd: React.TouchEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    handleKeyLeave();
  };

  return (
    <div className={`key ${keyType} ${isEmpty && "is-empty"} `}>
      {!isEmpty && (
        <button
          className={`note ${isPressed && "pressed"}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleKeyClick}
          onMouseUp={handleKeyLeave}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showLabel ? label : ""}
        </button>
      )}
    </div>
  );
};

export default Key;
