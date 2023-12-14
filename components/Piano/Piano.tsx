import React from "react";
import "./piano.styles.scss";
import { noteNames } from "@/utils/pianoNotes";
import { INote } from "@/types/global.types";
import Key from "./Key/Key";

interface IPiano {
  playedNotes: INote[];
  showLabel: boolean;
}

const Piano = ({ playedNotes, showLabel = false }: IPiano) => {
  const renderKeys = (color: "white" | "black") => {
    const keys = [];
    let skipKey = 1;
    let gapSwitcher = false;
    let notesLoopCount = 0;

    for (let i = 0; i < 52; i++) {
      const noteName = noteNames[i % noteNames.length];

      if (noteName === "C") notesLoopCount++;

      const blackNoteLabel = `${noteName}# ${notesLoopCount}`;
      const whiteNoteLabel = `${noteName}${notesLoopCount}`;

      if (color === "black") {
        let isEmpty = false;

        if (skipKey === i || i === 51) {
          isEmpty = true;
          gapSwitcher = !gapSwitcher;
          skipKey = gapSwitcher ? i + 3 : i + 4;
        }

        keys.push(
          <Key
            key={i}
            isEmpty={isEmpty}
            playedNotes={playedNotes}
            showLabel={showLabel}
            label={blackNoteLabel}
            keyType="black"
          />
        );
      } else {
        keys.push(
          <Key
            key={i}
            playedNotes={playedNotes}
            showLabel={showLabel}
            label={whiteNoteLabel}
          />
        );
      }
    }

    return keys;
  };

  return (
    <div className="piano">
      <div className="keys-container">
        <div className="white-keys-container">{renderKeys("white")}</div>
        <div className="black-keys-container">{renderKeys("black")}</div>
      </div>
    </div>
  );
};

export default Piano;
