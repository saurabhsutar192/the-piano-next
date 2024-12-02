import React, { useLayoutEffect, useRef, useState } from "react";
import "./piano.styles.scss";
import { noteNames, whiteKeyMap } from "@/utils/utils";
import { INote } from "@/types/global.types";
import Key from "./Key/Key";

interface IPiano {
  playedNotes: INote[];
  showLabel: boolean;
  handleNotePlay: (note: string, velocity?: number) => void;
  handleNoteLift: (note: string) => void;
  pianoSize: string;
}

const Piano = ({
  playedNotes,
  showLabel = false,
  handleNotePlay,
  handleNoteLift,
  pianoSize,
}: IPiano) => {
  const [isClicked, setIsClicked] = useState(false);

  const blackKeys = useRef<HTMLDivElement>(null);
  const whiteKeys = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const keyWidth = (
      whiteKeys?.current?.childNodes[0] as HTMLDivElement
    ).getBoundingClientRect().width;

    Object.assign((blackKeys.current as HTMLDivElement).style, {
      left: keyWidth / 2 + "px",
      fontSize: keyWidth / 2 + "px",
    });
  }, [blackKeys, pianoSize]);

  const renderKeys = (color: "white" | "black") => {
    const keys = [];
    let skipKey = 1;
    const totalWhiteKeys =
      whiteKeyMap[pianoSize as keyof typeof whiteKeyMap].whiteKeys;
    const startOctave =
      whiteKeyMap[pianoSize as keyof typeof whiteKeyMap].octave;
    let notesLoopCount = startOctave;
    const is88Keys = pianoSize === "88";
    const notesList = noteNames.map((x) => x);
    let gapSwitcher = !is88Keys;

    if (!is88Keys) {
      notesList.unshift(...notesList.splice(2));
      skipKey = 2;
    }

    for (let i = 0; i < totalWhiteKeys; i++) {
      const noteName = notesList[i % notesList.length];

      if (noteName === "C") notesLoopCount++;

      const blackNoteLabel = `${noteName}# ${notesLoopCount}`;
      const whiteNoteLabel = `${noteName}${notesLoopCount}`;

      if (color === "black") {
        let isEmpty = false;

        if (skipKey === i || i === totalWhiteKeys - 1) {
          isEmpty = true;
          gapSwitcher = !gapSwitcher;
          skipKey = gapSwitcher ? i + 3 : i + 4;
        }

        keys.push(
          <Key
            key={i}
            isEmpty={isEmpty}
            playedNotes={playedNotes}
            handleNotePlay={handleNotePlay}
            handleNoteLift={handleNoteLift}
            showLabel={showLabel}
            label={blackNoteLabel}
            keyType="black"
            isClicked={isClicked}
            setIsClicked={setIsClicked}
          />
        );
      } else {
        keys.push(
          <Key
            key={i}
            playedNotes={playedNotes}
            showLabel={showLabel}
            label={whiteNoteLabel}
            handleNotePlay={handleNotePlay}
            handleNoteLift={handleNoteLift}
            isClicked={isClicked}
            setIsClicked={setIsClicked}
          />
        );
      }
    }

    return keys;
  };

  return (
    <div className={`piano ${pianoSize === "25" && "small"}`}>
      <div className="keys-container">
        <div ref={whiteKeys} className="white-keys-container">
          {renderKeys("white")}
        </div>
        <div ref={blackKeys} className="black-keys-container">
          {renderKeys("black")}
        </div>
      </div>
    </div>
  );
};

export default Piano;
